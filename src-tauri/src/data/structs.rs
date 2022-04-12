use serde::{Deserialize, Serialize};

use super::CellData;

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
pub struct ConnectPayload {
  pub id: Option<String>,
  pub config: Option<ConnectionConfig>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PublicConnectionConfig {
  pub id: String,
  pub name: String,
  pub host: String,
  pub port: u32,
  pub username: String,
  pub database_name: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RenameTablePayload {
  pub original_name: String,
  pub new_name: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DeleteTablePayload {
  pub table_name: String,
  pub cascade: bool,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TableOverview {
  pub name: String,
  pub num_records: i64,
  pub num_columns: i64,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct QueryTablePayload {
  pub table_name: String,
  pub offset: u32,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TableData {
  pub headers: Vec<String>,
  pub data: Vec<Vec<CellData>>,
}
