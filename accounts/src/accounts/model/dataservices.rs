use diesel::r2d2::ConnectionManager;
use diesel::PgConnection;
use std::sync::Arc;

use crate::Config;

mod accounts;
pub use self::accounts::{AccountsDataservice, CreatableAccount, ReadableAccount};

mod sessions;
pub use sessions::{
  CreatableSession, ReadableSessionWithoutAccountId, ReadableSessionWithoutId, SessionsDataservice,
};

type DatabaseConnectionManager = ConnectionManager<PgConnection>;
type DatabaseConnectionPool = r2d2::Pool<DatabaseConnectionManager>;

pub struct Dataservices {
  pub accounts: Arc<AccountsDataservice>,
  pub sessions: Arc<SessionsDataservice>,
}

impl Dataservices {
  pub fn new(config: &Config) -> Self {
    let manager: DatabaseConnectionManager = ConnectionManager::new(&config.database.url);
    let pool: DatabaseConnectionPool = r2d2::Pool::new(manager).unwrap();
    let pool_pointer = Arc::new(pool);

    let accounts = Arc::new(AccountsDataservice::new(pool_pointer.clone()));
    let sessions = Arc::new(SessionsDataservice::new(pool_pointer.clone()));

    Dataservices { accounts, sessions }
  }
}
