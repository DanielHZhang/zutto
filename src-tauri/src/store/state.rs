use serde::{Deserialize, Serialize};

use super::ConnectionConfig;

#[derive(Debug, Deserialize, Serialize)]
pub struct State {
  pub databases: Vec<ConnectionConfig>,
}

impl State {
  pub fn new() -> Self {
    Self {
      databases: Vec::new(),
    }
  }
}
