use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ConnectionData {
  pub name: String,
  pub host: String,
  pub port: u32,
  pub username: String,
  pub password: String,
  pub database_name: String,
}
