use crate::model::schema::accounts;
use serde::{Serialize, Deserialize};

#[derive(Queryable, Serialize, Deserialize)]
pub struct Account {
    pub id: uuid::Uuid,
    pub username: String,
    pub password: String,
    pub email: String,
}

#[derive(Insertable, Serialize, Deserialize)]
#[table_name="accounts"]
pub struct NewAccount {
    pub username: String,
    pub password: String,
    pub email: String,
}