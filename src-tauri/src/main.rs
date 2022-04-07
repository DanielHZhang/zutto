#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod commands;
mod store;
mod utils;

use tauri::Manager;

use commands::{connect_to_database, fetch_all_tables, fetch_recent_databases, fetch_table_data};
use store::Store;

#[tokio::main]
async fn main() {
  tracing_subscriber::fmt::init();

  let store = Store::new().await;

  tauri::async_runtime::set(tokio::runtime::Handle::current());

  tauri::Builder::default()
    .manage::<Store>(store)
    .invoke_handler(tauri::generate_handler![
      connect_to_database,
      fetch_all_tables,
      fetch_recent_databases,
      fetch_table_data,
    ])
    .setup(|app| {
      #[cfg(debug_assertions)]
      app.get_window("main").unwrap().open_devtools();
      Ok(())
    })
    .on_window_event(|event| match event.event() {
      tauri::WindowEvent::Destroyed => {
        let store = event.window().state::<Store>();
        store.save_state();
      }
      _ => (),
    })
    .plugin(tauri_plugin_window_state::WindowState::default())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
