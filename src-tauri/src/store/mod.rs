mod enums;
mod structs;

use std::{
  error::Error,
  fs::OpenOptions,
  io::{BufReader, BufWriter},
};

use serde::{Deserialize, Serialize};
use sqlx::postgres::{PgPool, PgPoolOptions};
use tauri::async_runtime::Mutex;
use tokio::sync::MutexGuard;

pub use enums::*;
pub use structs::*;

use crate::utils::get_state_file_path;

#[derive(Debug, Deserialize, Serialize)]
pub struct State {
  recent_databases: Vec<ConnectionData>,
}

#[derive(Debug)]
pub struct Store {
  environment: Environment,
  active_pool: Mutex<Option<PgPool>>,
  state: State,
}

impl Store {
  pub async fn new() -> Self {
    let env = std::env::var("ENV").unwrap();

    let environment = match env.as_ref() {
      "development" => Environment::Development,
      "production" => Environment::Production,
      e => panic!("Invalid environment: {e}"),
    };

    let file_path = get_state_file_path(&environment);
    let file = OpenOptions::new()
      .read(true)
      .write(true)
      .create(true)
      .open(file_path)
      .expect("Failed to open state file for reading");
    let reader = BufReader::new(file);
    let store = {
      let read_result = serde_json::from_reader::<_, State>(reader);
      // if read_result.is_err() {
      // 	let new_store =
      // 	serde_json::to_writer(&file, )
      // }
    };

    Self {
      environment,
      active_pool: Mutex::new(None),
      state: State {
        recent_databases: Vec::new(),
      },
    }
  }

  pub async fn active_pool<'a>(&'a self) -> MutexGuard<'a, Option<PgPool>> {
    self.active_pool.lock().await
  }

  pub async fn set_active_pool<'a>(&'a self, url: &str) -> Result<(), Box<dyn Error>> {
    let mut guard = self.active_pool().await;

    if guard.is_some() {
      return Err("Client is already connected to database pool".into());
    }

    let pool = PgPoolOptions::new().max_connections(5).connect(url).await?;
    let _ = guard.insert(pool);
    Ok(())
  }

  pub async fn close_pool<'a>(&'a self) {
    let guard = self.active_pool().await;

    if guard.is_some() {
      let pool = guard.as_ref().unwrap();
      pool.close().await;
    }
  }

  pub fn save_state(&self) {
    let file_path = get_state_file_path(&self.environment);
    let file = OpenOptions::new()
      .write(true)
      .create(true)
      .open(file_path)
      .expect("Failed to open state file for writing");
    let writer = BufWriter::new(file);
    serde_json::to_writer::<_, State>(writer, &self.state).ok();
  }
}
