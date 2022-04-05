use tauri::State;
use tracing::{debug, instrument};

use crate::store::{ConnectionConfig, Store};

use super::result::{CommandError, CommandResult};

#[tauri::command]
#[instrument(skip(store), ret, err)]
pub async fn connect_to_database(
  store: State<'_, Store>,
  data: ConnectionConfig,
) -> CommandResult<()> {
  let ConnectionConfig {
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
  state.databases.push(data);

  Ok(())
}

#[tauri::command]
#[instrument(skip(store), ret, err)]
pub fn fetch_recent_databases(store: State<Store>) -> CommandResult<Vec<ConnectionConfig>> {
  let state = store.state();
  Ok(state.databases.clone())
}
