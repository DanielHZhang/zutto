use std::{
  fs::{File, OpenOptions},
  io::BufReader,
};

use directories::ProjectDirs;
use serde::{Deserialize, Serialize};
use sqlx::postgres::PgPool;
use tauri::async_runtime::Mutex;
use tokio::sync::MutexGuard;

#[derive(Debug, Deserialize, Serialize)]
pub enum Environment {
  Development,
  Production,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct DatabaseEntry {
  name: String,
  host: String,
  port: u32,
  username: String,
  password: String,
  db: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct State {
  recent_databases: Vec<DatabaseEntry>,
}

#[derive(Debug)]
pub struct Store {
  environment: Environment,
  active_pool: Option<Mutex<PgPool>>,
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

    let storage_directory = match environment {
      Environment::Development => {
        let mut directory = std::env::current_dir().unwrap();
        directory.push("target");
        directory
      }
      Environment::Production => ProjectDirs::from("com", "danielhzhang", "zutto")
        .expect("Failed to open project directory path")
        .data_dir()
        .to_owned(),
    };
    let mut storage_file_path = storage_directory;
    storage_file_path.push("store.json");

    let mut open_options = OpenOptions::new();
    let file = open_options
      .read(true)
      .write(true)
      .create(true)
      .open(storage_file_path)
      .expect("Failed to open storage file for read/write");

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
      active_pool: None,
      state: State {
        recent_databases: Vec::new(),
      },
    }
  }

  pub async fn active_pool<'a>(&'a self) -> Option<MutexGuard<'a, PgPool>> {
    match self.active_pool.as_ref() {
      Some(pool) => Some(pool.lock().await),
      None => None,
    }
  }
}
