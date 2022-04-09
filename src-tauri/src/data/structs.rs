use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ConnectionConfig {
  pub name: String,
  pub host: String,
  pub port: u32,
  pub username: String,
  pub password: String,
  pub database_name: String,
}

impl ConnectionConfig {
  pub fn to_url(&self) -> String {
    let Self {
      host,
      name,
      port,
      username,
      password,
      database_name,
      ..
    } = &self;
    format!("postgres://{username}:{password}@{host}:{port}/{database_name}")
  }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ConnectData {
  pub id: Option<String>,
  pub config: Option<ConnectionConfig>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct PublicConnectionConfig {
  pub id: String,
  pub host: String,
  pub port: u32,
  pub username: String,
  pub database_name: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RenameTableData {
  pub original_name: String,
  pub new_name: String,
}
