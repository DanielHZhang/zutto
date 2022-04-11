use std::{
  collections::HashMap,
  fs::OpenOptions,
  io::{BufReader, BufWriter},
  path::PathBuf,
};

use directories::ProjectDirs;
use serde::{Deserialize, Serialize};

use crate::data::{ConnectionConfig, Environment};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct State {
  pub active_connection_id: Option<String>,
  pub databases: HashMap<String, ConnectionConfig>,
  pub tabs: HashMap<String, Vec<String>>,
  environment: Environment,
}

impl Default for State {
  fn default() -> Self {
    Self {
      active_connection_id: None,
      environment: Environment::Development,
      databases: HashMap::new(),
      tabs: HashMap::new(),
    }
  }
}

impl State {
  pub fn new() -> Self {
    let env = std::env::var("ENV").unwrap();

    let environment = match env.as_ref() {
      "development" => Environment::Development,
      "production" => Environment::Production,
      e => panic!("Invalid environment: {e}"),
    };

    let file_path = Self::get_file_path(&environment);
    let file = OpenOptions::new()
      .read(true)
      .write(true)
      .create(true)
      .open(file_path)
      .expect("Failed to open state file for reading");
    let reader = BufReader::new(file);
    let state = serde_json::from_reader::<_, Self>(reader).unwrap_or_else(|_| Default::default());

    Self { environment, ..state }
  }

  pub fn get_file_path(environment: &Environment) -> PathBuf {
    let mut storage_directory = match environment {
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
    storage_directory.push("store.json");
    storage_directory
  }

  pub fn environment(&self) -> &Environment {
    &self.environment
  }

  pub fn save_to_file(&self) {
    let file_path = Self::get_file_path(&self.environment);
    let file = OpenOptions::new()
      .write(true)
      .create(true)
      .open(file_path)
      .expect("Failed to open state file for writing");
    let writer = BufWriter::new(file);
    serde_json::to_writer_pretty::<_, Self>(writer, &self).ok();
  }
}
