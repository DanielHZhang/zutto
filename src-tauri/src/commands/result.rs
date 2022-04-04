use std::error;
use std::fmt;
use std::result;
use std::str;

use serde::{Deserialize, Serialize};

pub type CommandResult<T> = result::Result<T, CommandError>;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct CommandError {
  message: String,
}

impl CommandError {
  pub fn new(message: &str) -> Self {
    Self {
      message: message.into(),
    }
  }
}

impl From<Box<dyn error::Error>> for CommandError {
  fn from(err: Box<dyn error::Error>) -> Self {
    Self {
      message: err.to_string(),
    }
  }
}

impl From<tauri::api::Error> for CommandError {
  fn from(err: tauri::api::Error) -> Self {
    Self {
      message: err.to_string(),
    }
  }
}

impl From<sqlx::error::Error> for CommandError {
  fn from(err: sqlx::error::Error) -> Self {
    Self {
      message: err.to_string(),
    }
  }
}

impl fmt::Display for CommandError {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "Executing Tauri command failed")
  }
}
