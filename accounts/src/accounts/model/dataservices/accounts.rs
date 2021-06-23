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
use crate::model::schema::sessions;
use crate::model::ServiceError;

pub struct AccountsDataservice {
  _pool: Arc<DatabaseConnectionPool>,
}

impl AccountsDataservice {
  pub fn new(pool: Arc<DatabaseConnectionPool>) -> Self {
    AccountsDataservice { _pool: pool }
  }

  pub fn create(&self, mut account: CreatableAccount) -> Result<ReadableAccount, ServiceError> {
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
      .get_result(&self._pool.get().unwrap())?;

    Ok(created_account)
  }

  pub fn read_by_id(&self, account_id: uuid::Uuid) -> Result<ReadableAccount, ServiceError> {
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
      .first(&self._pool.get().unwrap())?;

    Ok(account)
  }

  pub fn read_account_by_sid(&self, sid: uuid::Uuid) -> Result<ReadableAccount, ServiceError> {
    let account: ReadableAccount = sessions::table
      .inner_join(
        self::accounts::table.on(
          sessions::account_id
            .eq(self::accounts::id)
            .and(sessions::id.eq(sid)),
        ),
      )
      .select((
        self::accounts::id,
        self::accounts::email,
        self::accounts::first_name,
        self::accounts::last_name,
        self::accounts::birthday,
        self::accounts::create_time,
        self::accounts::update_time,
      ))
      .first(&self._pool.get().unwrap())?;

    Ok(account)
  }

  pub fn read_id_and_password_by_email(
    &self,
    acc_email: &String,
  ) -> Result<ReadableAccountWithIdAndPassword, ServiceError> {
    use self::accounts::dsl::*;

    let acc: ReadableAccountWithIdAndPassword = accounts
      .filter(email.eq(acc_email))
      .select((id, password))
      .first(&self._pool.get().unwrap())?;

    Ok(acc)
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

#[derive(Queryable, Serialize)]
pub struct ReadableAccountWithIdAndPassword {
  pub id: uuid::Uuid,
  pub password: String,
}
