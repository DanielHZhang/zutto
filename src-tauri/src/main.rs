#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

mod commands;
mod data;
mod store;

use tauri::{Manager, RunEvent};

use commands::{
  begin_connection, close_connection, close_tab, delete_connection, delete_table, edit_connection, fetch_tabs,
  open_tab, query_all_tables, query_recent_databases, query_table_data, rename_table,
};
use store::Store;

#[tokio::main]
async fn main() {
  tracing_subscriber::fmt::init();
  tauri::async_runtime::set(tokio::runtime::Handle::current());

  let store = Store::new();
  let app = tauri::Builder::default()
    .manage::<Store>(store)
    .invoke_handler(tauri::generate_handler![
      begin_connection,
      close_connection,
      delete_connection,
      delete_table,
      rename_table,
      edit_connection,
      query_all_tables,
      query_recent_databases,
      query_table_data,
      open_tab,
      close_tab,
      fetch_tabs,
    ])
    .setup(|app| {
      #[cfg(debug_assertions)]
      app.get_window("main").unwrap().open_devtools();
      Ok(())
    })
    .plugin(tauri_plugin_window_state::WindowState::default())
    .build(tauri::generate_context!())
    .expect("Error while running Tauri application");

  app.run(|app_handle, event| match event {
    RunEvent::ExitRequested { .. } => {
      let handle = app_handle.clone();
      tauri::async_runtime::spawn(async move {
        let store = handle.state::<Store>();
        let state = store.state().await;
        state.save_to_file();
      });
    }
    _ => (),
  });
}
