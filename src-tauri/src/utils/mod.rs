use std::path::PathBuf;

use directories::ProjectDirs;

use crate::store::Environment;

pub fn get_state_file_path(environment: &Environment) -> PathBuf {
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
