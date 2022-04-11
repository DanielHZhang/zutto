use futures::TryStreamExt;
use sqlx::{
  types::time::{Date, OffsetDateTime},
  Row,
};
use tauri::State;
use tracing::instrument;

use crate::{
  data::{CellData, DeleteTablePayload, QueryTablePayload, RenameTablePayload, TableData, TableOverview},
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
pub async fn query_table_data(store: State<'_, Store>, payload: QueryTablePayload) -> CommandResult<TableData> {
  match store.active_pool().await.as_ref() {
    Some(pool) => {
      let QueryTablePayload { table_name, offset } = payload;
      let columns: Vec<(String, String)> = sqlx::query(&format!(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table_name}'"
      ))
      .fetch_all(pool)
      .await?
      .into_iter()
      .map(|row| {
        let data_type: &str = row.get(1);
        (row.get(0), data_type.to_lowercase())
      })
      .collect();

      let query = format!("SELECT * FROM {table_name} LIMIT 1000 OFFSET {offset}");
      let mut rows = sqlx::query(&query).fetch(pool);
      let mut table_data = Vec::new();

      while let Some(row) = rows.try_next().await? {
        let mut row_data = Vec::with_capacity(columns.len());
        for (column_name, data_type) in columns
          .iter()
          .map(|(column_name, data_type)| -> (&str, &str) { (column_name.as_ref(), data_type.as_ref()) })
        {
          match data_type {
            "character varying" | "text" | "character" | "uuid" => {
              row_data.push(CellData::String(row.try_get(column_name)?));
            }
            "integer" => {
              row_data.push(CellData::Integer(row.try_get(column_name)?));
            }
            "jsonb" => {
              row_data.push(CellData::Json(row.try_get(column_name)?));
            }
            "numeric" => {
              row_data.push(CellData::BigDecimal(row.try_get(column_name)?));
            }
            "boolean" => {
              row_data.push(CellData::Boolean(row.try_get(column_name)?));
            }
            "date" => {
              let date: Date = row.try_get(column_name)?;
              let year = date.year();
              let ordinal = date.ordinal();
              row_data.push(CellData::Date(time::Date::from_ordinal_date(year, ordinal)?));
            }
            "timestamp with time zone" => {
              let date_time: OffsetDateTime = row.try_get(column_name)?;
              row_data.push(CellData::DateTimeZone(time::OffsetDateTime::from_unix_timestamp(
                date_time.unix_timestamp(),
              )?));
            }
            // "array" => {
            //   //
            // }
            _ => (),
          }
        }
        table_data.push(row_data);
      }

      Ok(TableData {
        headers: columns.into_iter().map(|(column_name, _)| column_name).collect(),
        data: table_data,
      })
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
pub async fn delete_table(store: State<'_, Store>, payload: DeleteTablePayload) -> CommandResult<()> {
  match store.active_pool().await.as_ref() {
    Some(pool) => {
      let DeleteTablePayload { table_name, cascade } = payload;
      let query = format!(
        "DROP TABLE IF EXISTS {table_name} {}",
        if cascade { "CASCADE" } else { "RESTRICT" }
      );
      sqlx::query(&query).execute(pool).await?;

      // Make sure tab is also deleted
      let mut state = store.state().await;
      if let Some(id) = state.active_connection_id.clone() {
        if let Some(tabs) = state.tabs.get_mut(&id) {
          let found_index = tabs.iter().position(|tab| tab == &table_name);
          if let Some(index) = found_index {
            tabs.remove(index);
          }
        }
      }

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
      } = rename;
      let query = format!("ALTER TABLE {original_name} RENAME TO {new_name}");
      sqlx::query(&query).execute(pool).await?;

      // Make sure tab is also renamed
      let mut state = store.state().await;
      if let Some(id) = state.active_connection_id.clone() {
        if let Some(tabs) = state.tabs.get_mut(&id) {
          for tab_name in tabs.iter_mut() {
            if tab_name == &original_name {
              *tab_name = new_name;
              break;
            }
          }
        }
      }

      Ok(())
    }
    None => Err(CommandError::new("Client is not connected to a database")),
  }
}
