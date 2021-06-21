use chrono::prelude::*;
use diesel::prelude::*;
use pbkdf2::{
  password_hash::{PasswordHasher, SaltString},
  Pbkdf2,
};
use rand_core::OsRng;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use super::DatabaseConnectionPool;
use crate::model::schema::accounts;

pub struct AccountsDataservice {
  _pool: Arc<DatabaseConnectionPool>,
}

impl AccountsDataservice {
  pub fn new(pool: Arc<DatabaseConnectionPool>) -> Self {
    AccountsDataservice { _pool: pool }
  }

  pub fn create(&self, mut account: CreatableAccount) -> ReadableAccount {
    use self::accounts::dsl::*;

    let salt = SaltString::generate(&mut OsRng);
    let hash = Pbkdf2
      .hash_password_simple(&account.password.as_bytes(), salt.as_ref())
      .unwrap()
      .to_string();

    account.password = hash;

    let created_account: ReadableAccount = diesel::insert_into(accounts)
      .values(account)
      .returning((
        id,
        email,
        first_name,
        last_name,
        birthday,
        create_time,
        update_time,
      ))
      .get_result(&self._pool.get().unwrap())
      .unwrap();

    created_account
  }

  pub fn read_by_id(&self, account_id: uuid::Uuid) -> ReadableAccount {
    use self::accounts::dsl::*;

    let account: ReadableAccount = accounts
      .filter(id.eq(account_id))
      .select((
        id,
        email,
        first_name,
        last_name,
        birthday,
        create_time,
        update_time,
      ))
      .first(&self._pool.get().unwrap())
      .unwrap();

    account
  }
}

#[derive(Insertable, Deserialize)]
#[table_name = "accounts"]
pub struct CreatableAccount {
  pub email: String,
  pub password: String,
  pub first_name: Option<String>,
  pub last_name: Option<String>,
  pub birthday: Option<NaiveDate>,
}

#[derive(Queryable, Serialize)]
pub struct ReadableAccount {
  pub id: uuid::Uuid,
  pub email: String,
  pub first_name: Option<String>,
  pub last_name: Option<String>,
  pub birthday: Option<NaiveDate>,
  pub create_time: DateTime<Utc>,
  pub update_time: DateTime<Utc>,
}
