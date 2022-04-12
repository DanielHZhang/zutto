use std::{error::Error, time::Duration};

use sqlx::postgres::{PgPool, PgPoolOptions};
use tokio::sync::{Mutex, MutexGuard};

use super::State;

#[derive(Debug)]
pub struct Store {
  active_pool: Mutex<Option<PgPool>>,
  state: Mutex<State>,
}

impl Store {
  pub fn new() -> Self {
    Self {
      active_pool: Mutex::new(None),
      state: Mutex::new(State::new()),
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

    let pool = PgPoolOptions::new()
      .max_connections(5)
      .connect_timeout(Duration::from_secs(10))
      .connect(url)
      .await?;
    let _ = guard.insert(pool);

    Ok(())
  }

  pub async fn close_pool<'a>(&'a self) {
    let mut guard = self.active_pool().await;

    if guard.is_some() {
      let pool = guard.as_ref().unwrap();
      pool.close().await;
      *guard = None;
      self.state.lock().await.active_connection_id = None;
    }
  }

  pub async fn state<'a>(&'a self) -> MutexGuard<'a, State> {
    self.state.lock().await
  }
}
