#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod commands;
mod store;

use crate::commands::fetch_recent_databases;
use crate::store::Store;

#[tokio::main]
async fn main() {
  let store = Store::new().await;

  tauri::async_runtime::set(tokio::runtime::Handle::current());

  tauri::Builder::default()
    .manage::<Store>(store)
    .invoke_handler(tauri::generate_handler![fetch_recent_databases])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
