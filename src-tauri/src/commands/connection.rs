use tauri::State;
use tracing::instrument;

use crate::{
  data::{ConnectPayload, PublicConnectionConfig},
  store::Store,
};

use super::result::{CommandError, CommandResult};

#[tauri::command]
#[instrument(skip(store), ret, err)]
pub async fn connect_to_database(store: State<'_, Store>, data: ConnectPayload) -> CommandResult<()> {
  match data.id {
    Some(id) => {
      let state = store.state().await;
      let config = state
        .databases
        .get(&id)
        .ok_or(CommandError::new("Unable to find database with provided id"))?;

      let connection_url = config.to_url();
      store.set_active_pool(&connection_url).await?;
      Ok(())
    }
    None => {
      let config = data
        .config
        .ok_or(CommandError::new("Unable to find database with provided id"))?;
      let connection_url = config.to_url();
      store.set_active_pool(&connection_url).await?;

      let mut state = store.state().await;
      let id = uuid::Uuid::new_v4().to_string();
      state.databases.insert(id, config);
      Ok(())
    }
  }
}

#[tauri::command]
#[instrument(skip(store), ret, err)]
pub async fn edit_connection(store: State<'_, Store>, data: ConnectPayload) -> CommandResult<()> {
  match (data.id, data.config) {
    (Some(id), Some(config)) => {
      let mut state = store.state().await;
      state.databases.insert(id, config);
      Ok(())
    }
    _ => Err(CommandError::new("Missing connection id or config in payload")),
  }
}

#[tauri::command]
#[instrument(skip(store), ret, err)]
pub async fn delete_connection(store: State<'_, Store>, id: String) -> CommandResult<()> {
  let mut state = store.state().await;
  let _ = state.databases.remove(&id);
  Ok(())
}

#[tauri::command]
#[instrument(skip(store), ret, err)]
pub async fn query_recent_databases(store: State<'_, Store>) -> CommandResult<Vec<PublicConnectionConfig>> {
  let state = store.state().await;
  let public_connection_configs = state
    .databases
    .iter()
    .map(|(id, config)| PublicConnectionConfig {
      id: id.into(),
      host: config.host.clone(),
      port: config.port,
      username: config.username.clone(),
      database_name: config.database_name.clone(),
    })
    .collect::<Vec<_>>();

  Ok(public_connection_configs)
}
