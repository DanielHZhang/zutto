use futures::TryStreamExt;
use sqlx::Row;
use tauri::State;
use tracing::instrument;

use crate::store::Store;

use super::{CommandError, CommandResult};

#[tauri::command]
#[instrument(skip(store), ret, err)]
pub async fn fetch_all_tables(store: State<'_, Store>) -> CommandResult<Vec<String>> {
  match store.active_pool().await.as_ref() {
    Some(pool) => {
      let query = "SELECT table_name FROM information_schema.tables WHERE table_schema='public'";
      let mut rows = sqlx::query(query).fetch(pool);
      let mut table_names = Vec::new();

      while let Some(row) = rows.try_next().await? {
        let name: String = row.get(0);
        table_names.push(name);
      }

      Ok(table_names)
    }
    None => Err(CommandError::new("Client is not connected to a database")),
  }
}

#[tauri::command]
#[instrument(skip(store), ret, err)]
pub async fn fetch_table_data(store: State<'_, Store>, table_name: String) -> CommandResult<()> {
  match store.active_pool().await.as_ref() {
    Some(pool) => {
      let query = format!("SELECT * FROM {table_name}");
      let mut rows = sqlx::query(&query).fetch(pool);

      println!("gets here");
      while let Some(row) = rows.try_next().await? {
        println!("inside while let");
        let test: i32 = row.try_get(0).unwrap();
        let col2: &str = row.try_get(1).unwrap();
        println!("{test} ${col2}");
      }

      Ok(())
    }
    None => Err(CommandError::new("Client is not connected to a database")),
  }
}
