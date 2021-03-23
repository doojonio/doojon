use crate::model::models::{Account, NewAccount};
use crate::model::errors::ServiceError;
use rand_core::OsRng;
use diesel::{self, PgConnection};
use diesel::prelude::*;
use pbkdf2::{Pbkdf2, password_hash::{SaltString, PasswordHasher}};

pub fn create(conn: &PgConnection, mut account: NewAccount) -> Result<Account, ServiceError> {

  use crate::model::schema::accounts::dsl::*;

  let salt = SaltString::generate(&mut OsRng);
  account.password = Pbkdf2.hash_password_simple(account.password.as_bytes(), salt.as_ref()).
    unwrap().to_string();

  let created_account = diesel::insert_into(accounts)
    .values(account).
    returning((id, email, first_name, last_name, birthday))
    .get_result(conn)?;

  Ok(created_account)
}

pub fn read(conn: &PgConnection, account_id: uuid::Uuid) -> Result<Account, diesel::result::Error> {

  use crate::model::schema::accounts::dsl::*;
  accounts.find(account_id).select((id, email, first_name, last_name, birthday)).first::<Account>(conn)
}

fn _hash_password(password: &String) {
}