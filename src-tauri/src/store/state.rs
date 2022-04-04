use serde::{Deserialize, Serialize};

use super::ConnectionData;

#[derive(Debug, Deserialize, Serialize)]
pub struct State {
  pub recent_databases: Vec<ConnectionData>,
}

impl State {
  pub fn new() -> Self {
    Self {
      recent_databases: Vec::new(),
    }
  }
}
