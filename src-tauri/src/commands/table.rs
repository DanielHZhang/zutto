use sqlx::Row;
use tauri::State;

use crate::store::Store;

use super::{CommandError, CommandResult};

#[tauri::command]
pub async fn fetch_all_tables(store: State<'_, Store>) -> CommandResult<()> {
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
