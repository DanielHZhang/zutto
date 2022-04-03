use tauri::State;

use crate::store::Store;

#[tauri::command]
pub async fn fetch_recent_databases(store: State<'_, Store>) -> Result<(), ()> {
  //
  Ok(())
}
