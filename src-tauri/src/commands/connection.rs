use tauri::State;

use crate::store::Store;

use super::result::{CommandError, CommandResult};

#[tauri::command]
pub async fn connect_to_database(store: State<'_, Store>) -> CommandResult<()> {
  let pool = store.active_pool().await;
  match pool {
    Some(_) => ,
    None => {
      let url = "";
      store.set_active_pool(url).await.unwrap();
      Ok(())
    }
  }
}

#[tauri::command]
pub async fn fetch_recent_databases(store: State<'_, Store>) -> Result<(), ()> {
  //
  Ok(())
}
