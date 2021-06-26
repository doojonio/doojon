use pbkdf2::{
  password_hash::{PasswordHash, PasswordVerifier},
  Pbkdf2,
};
use std::sync::Arc;

use crate::model::dataservices::{
  AccountsDataservice, ReadableSessionWithoutAccountId, SessionsDataservice,
};
use crate::model::ServiceError;

pub struct AuthService {
  _accounts: Arc<AccountsDataservice>,
  _sessions: Arc<SessionsDataservice>,
}

impl AuthService {
  pub fn new(accounts: Arc<AccountsDataservice>, sessions: Arc<SessionsDataservice>) -> Self {
    AuthService {
      _accounts: accounts,
      _sessions: sessions,
    }
  }

  pub fn auth_using_password(
    &self,
    email: &String,
    password: &String,
  ) -> Result<ReadableSessionWithoutAccountId, ServiceError> {
    let acc = self._accounts.read_id_and_password_by_email(email)?;
    let hash = PasswordHash::new(&acc.password).unwrap();
    let result = Pbkdf2.verify_password(password.as_bytes(), &hash);

    if result.is_err() {
      return Err(ServiceError::Unauthorized);
    }

    self._sessions.create(&acc.id)
  }
}
