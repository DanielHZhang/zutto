use futures::TryStreamExt;
use sqlx::Row;
use tauri::State;
use tracing::instrument;

use crate::{
  data::{RenameTableData, TableOverview},
  store::Store,
};

use super::{CommandError, CommandResult};

#[tauri::command]
#[instrument(skip(store), ret, err)]
pub async fn query_all_tables(store: State<'_, Store>) -> CommandResult<Vec<TableOverview>> {
  match store.active_pool().await.as_ref() {
    Some(pool) => {
      let query = "SELECT table_name FROM information_schema.tables WHERE table_schema='public'";
      let mut name_rows = sqlx::query(query).fetch(pool);
      let mut table_names = Vec::new();

      while let Some(row) = name_rows.try_next().await? {
        let name: String = row.try_get("table_name")?;

        let num_records: u32 = sqlx::query(&format!(
          "SELECT reltuples AS estimate FROM pg_class WHERE relname = '{name}'"
        ))
        .fetch_one(pool)
        .await?
        .try_get("estimate")?;

        let num_columns: u32 = sqlx::query(&format!(
          "SELECT count(*) FROM information_schema.columns WHERE table_name = '{name}'"
        ))
        .fetch_one(pool)
        .await?
        .try_get("count")?;

        table_names.push(TableOverview {
          name,
          num_records,
          num_columns,
        });
      }

      Ok(table_names)
    }
    None => Err(CommandError::new("Client is not connected to a database")),
  }
}

#[tauri::command]
#[instrument(skip(store), ret, err)]
pub async fn query_table_data(store: State<'_, Store>, table_name: String) -> CommandResult<()> {
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

#[tauri::command]
#[instrument(skip(store), ret, err)]
pub async fn create_table(store: State<'_, Store>, rename: RenameTableData) -> CommandResult<()> {
  match store.active_pool().await.as_ref() {
    Some(pool) => {
      // let RenameTableData {
      //   original_name,
      //   new_name,
      // } = &rename;
      // let query = format!("ALTER TABLE {original_name} RENAME TO {new_name}");
      // sqlx::query(&query).execute(pool).await?;
      Ok(())
    }
    None => Err(CommandError::new("Client is not connected to a database")),
  }
}

#[tauri::command]
#[instrument(skip(store), ret, err)]
pub async fn rename_table(store: State<'_, Store>, rename: RenameTableData) -> CommandResult<()> {
  match store.active_pool().await.as_ref() {
    Some(pool) => {
      let RenameTableData {
        original_name,
        new_name,
      } = &rename;
      let query = format!("ALTER TABLE {original_name} RENAME TO {new_name}");
      sqlx::query(&query).execute(pool).await?;
      Ok(())
    }
    None => Err(CommandError::new("Client is not connected to a database")),
  }
}
