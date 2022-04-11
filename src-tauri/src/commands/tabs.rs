use tauri::State;
use tracing::instrument;

use crate::store::Store;

use super::{CommandError, CommandResult};

#[tauri::command]
#[instrument(skip(store), ret, err)]
pub async fn open_tab(store: State<'_, Store>, connection_id: String, table_name: String) -> CommandResult<()> {
  let mut state = store.state().await;
  let open_tabs = state
    .tabs
    .get_mut(&connection_id)
    .ok_or(CommandError::new("Unable to find connection with provided id"))?;

  open_tabs.push(table_name);
  Ok(())
}

#[tauri::command]
#[instrument(skip(store), ret, err)]
pub async fn close_tab(store: State<'_, Store>, connection_id: String, table_name: String) -> CommandResult<()> {
  let mut state = store.state().await;
  let open_tabs = state
    .tabs
    .get_mut(&connection_id)
    .ok_or(CommandError::new("Unable to find connection with provided id"))?;

  let found_index = open_tabs
    .iter()
    .position(|tab| tab == &table_name)
    .ok_or(CommandError::new("Unable to find tab with provided name"))?;

  open_tabs.remove(found_index);
  Ok(())
}

#[tauri::command]
#[instrument(skip(store), ret, err)]
pub async fn fetch_tabs(store: State<'_, Store>, connection_id: String) -> CommandResult<Vec<String>> {
  let state = store.state().await;
  let open_tabs = state
    .tabs
    .get(&connection_id)
    .ok_or(CommandError::new("Unable to find connection with provided id"))?;

  Ok(open_tabs.clone())
}
