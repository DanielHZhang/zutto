use tauri::State;

use crate::store::Store;

use super::result::{CommandError, CommandResult};

#[tauri::command]
pub async fn connect_to_database(store: State<'_, Store>) -> CommandResult<()> {
  let pool = store.active_pool().await;
  match pool {
    Some(p) => {
      //
      Ok(())
    }
    None => Err(CommandError::new(
      "Client is already connected to database pool",
    )),
  }
}

#[tauri::command]
pub async fn fetch_recent_databases(store: State<'_, Store>) -> Result<(), ()> {
  //
  Ok(())
}
