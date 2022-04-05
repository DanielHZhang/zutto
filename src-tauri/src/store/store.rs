use std::{
  error::Error,
  fs::OpenOptions,
  io::{BufReader, BufWriter},
  sync::Arc,
  time::Duration,
};

use sqlx::postgres::{PgPool, PgPoolOptions};
use tokio::sync::{Mutex, MutexGuard};

use crate::{commands::CommandError, utils::get_state_file_path};

use super::{Environment, State};

#[derive(Debug)]
pub struct Store {
  environment: Environment,
  active_pool: tokio::sync::Mutex<Option<PgPool>>,
  state: Arc<std::sync::Mutex<State>>,
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
    let state = serde_json::from_reader::<_, State>(reader).unwrap_or_else(|_| State::new());

    Self {
      environment,
      active_pool: Mutex::new(None),
      state: Arc::new(std::sync::Mutex::new(state)),
    }
  }

  pub fn state<'a>(&'a self) -> std::sync::MutexGuard<'a, State> {
    self.state.lock().unwrap()
  }

  pub async fn active_pool<'a>(&'a self) -> MutexGuard<'a, Option<PgPool>> {
    self.active_pool.lock().await
  }

  pub async fn set_active_pool<'a>(&'a self, url: &str) -> Result<(), Box<dyn Error>> {
    let mut guard = self.active_pool().await;

    if guard.is_some() {
      return Err("Client is already connected to database pool".into());
    }

    let pool = PgPoolOptions::new()
      .max_connections(5)
      .connect_timeout(Duration::from_secs(10))
      .connect(url)
      .await?;
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
    let state = self.state.lock().unwrap();
    let file_path = get_state_file_path(&self.environment);
    let file = OpenOptions::new()
      .write(true)
      .create(true)
      .open(file_path)
      .expect("Failed to open state file for writing");
    let writer = BufWriter::new(file);
    serde_json::to_writer_pretty::<_, State>(writer, &state).ok();
  }
}
