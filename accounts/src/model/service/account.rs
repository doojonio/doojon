use crate::model::models::{Account, NewAccount};
use crate::model::errors::ServiceError;
use rand_core::OsRng;
use diesel::{self, PgConnection};
use diesel::prelude::*;
use pbkdf2::{Pbkdf2, password_hash::{SaltString, PasswordHasher, PasswordVerifier, PasswordHash}};

pub fn create(conn: &PgConnection, mut account: NewAccount) -> Result<Account, ServiceError> {

  use crate::model::schema::accounts::dsl::*;

  let salt = SaltString::generate(&mut OsRng);
  account.password = Pbkdf2.hash_password_simple(account.password.as_bytes(), salt.as_ref()).
    unwrap().to_string();

  let created_account: Account = diesel::insert_into(accounts)
    .values(account).
    returning((id, email, first_name, last_name, birthday))
    .get_result(conn)?;

  Ok(created_account)
}

pub fn read(conn: &PgConnection, account_id: uuid::Uuid) -> Result<Account, ServiceError> {

  use crate::model::schema::accounts::dsl::*;
  let account: Account = accounts.find(account_id).select((id, email, first_name, last_name, birthday)).first(conn)?;
  Ok(account)
}

pub fn password_auth(conn: &PgConnection, user_email: &String, user_password: &String) -> Result<bool, ServiceError> {

  use crate::model::schema::accounts::dsl::*;
  let password_hash: String = accounts.filter(email.eq(user_email)).select(password).get_result(conn)?;

  let password_hash = PasswordHash::new(&password_hash).unwrap();
  match Pbkdf2.verify_password(user_password.as_bytes(), &password_hash) {
    Ok(_) => Ok(true),
    Err(_) => Ok(false)
  }
}
