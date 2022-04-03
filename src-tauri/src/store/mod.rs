use std::{
  fs::{File, OpenOptions},
  io::BufReader,
};

use directories::ProjectDirs;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub enum Environment {
  Development,
  Production,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Store {
  environment: Environment,
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
      let read_result = serde_json::from_reader::<_, Store>(reader);
      // if read_result.is_err() {
      // 	let new_store =
      // 	serde_json::to_writer(&file, )
      // }
    };

    Self { environment }
  }
}
