use std::sync::Arc;

use super::Dataservices;

mod auth;
pub use auth::AuthService;

pub struct Services {
  pub auth: Arc<AuthService>,
}

impl Services {
  pub fn new(dataservices: &Dataservices) -> Self {
    let auth = Arc::new(AuthService::new(
      dataservices.accounts.clone(),
      dataservices.sessions.clone(),
    ));
    Services { auth }
  }
}
