#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

mod commands;
mod data;
mod store;

use tauri::{Manager, RunEvent};

use commands::{
  connect_to_database, delete_connection, edit_connection, query_all_tables, query_recent_databases, query_table_data,
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
      connect_to_database,
      delete_connection,
			edit_connection,
      query_all_tables,
      query_recent_databases,
      query_table_data,
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
