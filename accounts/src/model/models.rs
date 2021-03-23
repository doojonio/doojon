use crate::model::schema::accounts;
use serde::{Serialize, Deserialize};
use chrono::NaiveDate;

#[derive(Queryable, Serialize, Deserialize)]
pub struct Account {
  pub id: uuid::Uuid,
  pub email: String,
  pub first_name: Option<String>,
  pub last_name: Option<String>,
  pub birthday: Option<NaiveDate>,
}

#[derive(Insertable, Serialize, Deserialize)]
#[table_name="accounts"]
pub struct NewAccount {
  pub email: String,
  pub password: String,
  pub first_name: Option<String>,
  pub last_name: Option<String>,
  pub birthday: Option<NaiveDate>,
}
