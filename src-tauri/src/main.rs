#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod commands;
mod store;

use tauri::Manager;

use commands::{connect_to_database, fetch_recent_databases};
use store::Store;

#[tokio::main]
async fn main() {
  let store = Store::new().await;

  tauri::async_runtime::set(tokio::runtime::Handle::current());

  tauri::Builder::default()
    .manage::<Store>(store)
    .invoke_handler(tauri::generate_handler![
      connect_to_database,
      fetch_recent_databases
    ])
    .on_window_event(|event| match event.event() {
      tauri::WindowEvent::Destroyed => {
				println!("window destroyed")
        // hide window whenever it loses focus
        // if !focused {
        //   event.window().hide().unwrap();
        // }
      }
      _ => (),
    })
    .plugin(tauri_plugin_window_state::WindowState::default())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
