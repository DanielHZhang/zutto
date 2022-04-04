use tauri::State;

use crate::store::{ConnectionData, Store};

use super::result::{CommandError, CommandResult};

#[tauri::command]
pub async fn connect_to_database(
  store: State<'_, Store>,
  data: ConnectionData,
) -> CommandResult<()> {
  let ConnectionData {
    host,
    port,
    username,
    password,
    db,
    ..
  } = data;
  let url = format!("postgres://{username}:{password}@{host}:{port}/{db}");
  store.set_active_pool(&url).await.ok();
  Ok(())
}

#[tauri::command]
pub async fn fetch_recent_databases(store: State<'_, Store>) -> Result<(), ()> {
  //
  Ok(())
}
