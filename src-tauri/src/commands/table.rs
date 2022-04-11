use futures::TryStreamExt;
use sqlx::Row;
use tauri::State;
use tracing::instrument;

use crate::{
  data::{QueryTablePayload, RenameTablePayload, TableOverview},
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

        let num_records: i64 = sqlx::query(&format!(
          "SELECT reltuples::bigint AS estimate FROM pg_class WHERE relname = '{name}'"
        ))
        .fetch_one(pool)
        .await?
        .try_get("estimate")?;

        let num_columns: i64 = sqlx::query(&format!(
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
pub async fn query_table_data(store: State<'_, Store>, payload: QueryTablePayload) -> CommandResult<Vec<Vec<String>>> {
  match store.active_pool().await.as_ref() {
    Some(pool) => {
      let QueryTablePayload { table_name, offset } = payload;
      let columns = sqlx::query(&format!(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table_name}'"
      ))
      .fetch_all(pool)
      .await?
      .into_iter()
      .map(|row| -> (String, String) { (row.get(0), row.get(1)) })
      .collect::<Vec<_>>();

      let query = format!("SELECT * FROM {table_name} LIMIT 1000 OFFSET {offset}");
      let mut rows = sqlx::query(&query).fetch(pool);

      let mut table_data = Vec::new();

      while let Some(row) = rows.try_next().await? {
        let mut row_data = Vec::with_capacity(columns.len());
        for (column_name, data_type) in columns.iter().map(|(c, d)| (c.as_ref(), d.as_ref())) {
          let column_name: &str = column_name;
          let data_type: &str = data_type;
          // let data: String = row.try_get(column_name)?;
          let wow: String = format!("{:#?}", row.try_get(column_name)?);
          row_data.push(wow);
          // match data_type {
          //   "character varying" | "text" | "character" | "uuid" | "timestamp with time zone" => {
          //     let data: String = row.try_get(column_name)?;
          //     row_data.push(data);
          //   }
          //   "integer" => {
          //     let data: i32 = row.try_get(column_name)?;
          //     row_data.push(data.to_string());
          //   }
          //   _ => (),
          // }
        }
        table_data.push(row_data);
      }

      Ok(table_data)
    }
    None => Err(CommandError::new("Client is not connected to a database")),
  }
}

#[tauri::command]
#[instrument(skip(store), ret, err)]
pub async fn create_table(store: State<'_, Store>, rename: RenameTablePayload) -> CommandResult<()> {
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
pub async fn rename_table(store: State<'_, Store>, rename: RenameTablePayload) -> CommandResult<()> {
  match store.active_pool().await.as_ref() {
    Some(pool) => {
      let RenameTablePayload {
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
