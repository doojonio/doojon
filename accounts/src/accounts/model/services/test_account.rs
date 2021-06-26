use crate::model::dataservices::{AccountsDataservice, CreatableAccount};
use rand::{distributions::Alphanumeric, Rng};
use std::sync::Arc;

pub struct TestAccountService {
  _accounts: Arc<AccountsDataservice>,
}

impl TestAccountService {
  pub fn new(accounts: Arc<AccountsDataservice>) -> Self {
    Self {
      _accounts: accounts,
    }
  }

  pub async fn new_test_account(&self) -> TestAccount {
    loop {
      let random_string: String = rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(10)
        .map(char::from)
        .collect();
      let test_user_email = format!("testuser{}@doojon.com", random_string);

      if !self._accounts.is_email_uniq(&test_user_email).unwrap() {
        continue;
      }

      let account = self
        ._accounts
        .create(CreatableAccount {
          email: test_user_email.clone(),
          password: random_string.clone(),
          birthday: None,
          first_name: Some(String::from("User")),
          last_name: Some(String::from("Userov")),
        })
        .unwrap();

      return TestAccount {
        id: account.id,
        email: test_user_email,
        password: random_string,
      };
    }
  }
}

#[derive(serde::Serialize)]
pub struct TestAccount {
  pub id: uuid::Uuid,
  pub email: String,
  pub password: String,
}
