use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct ConnectionData {
  name: String,
  host: String,
  port: u32,
  username: String,
  password: String,
  db: String,
}
