use sqlx::Row;
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
pub async fn fetch_recent_databases(store: State<'_, Store>) -> CommandResult<()> {
  let pool = store.active_pool().await;
  match pool.as_ref() {
    Some(p) => {
      let rows =
        sqlx::query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
          .fetch_all(p)
          .await
          .unwrap();

      for row in rows.iter() {
        let a: &str = row.try_get(0)?;
        println!("{a}");
      }
      Ok(())
    }
    None => Err(CommandError::new("Client is not connected to a database")),
  }
}
