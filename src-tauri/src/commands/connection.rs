use tauri::State;
use tracing::{debug, instrument};

use crate::store::{ConnectionData, Store};

use super::result::{CommandError, CommandResult};

#[tauri::command]
#[instrument(name = "command", skip(store), ret, err)]
pub async fn connect_to_database(
  store: State<'_, Store>,
  data: ConnectionData,
) -> CommandResult<()> {
  let ConnectionData {
    host,
    port,
    username,
    password,
    database_name,
    ..
  } = &data;
  let url = format!("postgres://{username}:{password}@{host}:{port}/{database_name}");
  store.set_active_pool(&url).await.ok();

  let mut state = store.state();
  state.recent_databases.push(data);

  Ok(())
}

#[tauri::command]
#[instrument(name = "command", skip(store), ret, err)]
pub fn fetch_recent_databases(store: State<Store>) -> CommandResult<Vec<ConnectionData>> {
  let state = store.state();
  Ok(state.recent_databases.clone())
}
