use sqlx::{postgres::PgRow, Row};
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
      let rows = sqlx::query(query).fetch_all(pool).await.unwrap();
      let mut table_names = Vec::with_capacity(rows.len());

      for (index, row) in rows.iter().enumerate() {
        let name: String = row.get(0);
        table_names.push(name);
      }
      // println!("start");
      // for row in rows.iter() {
      //   let a: &str = row.try_get(0)?;
      //   println!("{a}");
      // }
      Ok(table_names)
    }
    None => Err(CommandError::new("Client is not connected to a database")),
  }
}
