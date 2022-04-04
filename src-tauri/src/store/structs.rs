use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct ConnectionData {
  pub name: String,
  pub host: String,
  pub port: u32,
  pub username: String,
  pub password: String,
  pub database_name: String,
}
