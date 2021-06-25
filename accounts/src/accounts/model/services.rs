use std::sync::Arc;

use super::Dataservices;

mod auth;
pub use auth::AuthService;

mod test_account;
pub use test_account::TestAccountService;

pub struct Services {
  pub auth: Arc<AuthService>,
  pub test_account: Arc<TestAccountService>,
}

impl Services {
  pub fn new(dataservices: &Dataservices) -> Self {
    let auth = Arc::new(AuthService::new(
      dataservices.accounts.clone(),
      dataservices.sessions.clone(),
    ));
    let test_account = Arc::new(TestAccountService::new(dataservices.accounts.clone()));

    Services { auth, test_account }
  }
}
