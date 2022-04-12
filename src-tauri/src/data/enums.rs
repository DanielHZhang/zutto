use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use time::{Date, OffsetDateTime, PrimitiveDateTime};

#[derive(Copy, Clone, Debug, Deserialize, Serialize)]
pub enum Environment {
  Development,
  Production,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(untagged)]
pub enum CellData {
  String(String),
  Integer(i32),
  Boolean(bool),
  BigDecimal(Decimal),
  DateTimeZone(OffsetDateTime),
  DateTime(PrimitiveDateTime),
  Date(Date),
  Json(serde_json::Value),
}
