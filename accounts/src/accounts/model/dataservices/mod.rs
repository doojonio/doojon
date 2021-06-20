use diesel::r2d2::ConnectionManager;
use diesel::PgConnection;
use std::sync::Arc;

use crate::Config;

mod accounts;
pub use accounts::{AccountsDataservice, CreatableAccount, ReadableAccount};

type DatabaseConnectionManager = ConnectionManager<PgConnection>;
type DatabaseConnectionPool = r2d2::Pool<DatabaseConnectionManager>;

pub struct Dataservices {
  accounts: AccountsDataservice,
}

impl Dataservices {
  pub fn new(config: &Config) -> Self {
    let manager: DatabaseConnectionManager = ConnectionManager::new(&config.database.url);
    let pool: DatabaseConnectionPool = r2d2::Pool::new(manager).unwrap();
    let pool_pointer = Arc::new(pool);

    let accounts = AccountsDataservice::new(pool_pointer.clone());

    Dataservices { accounts }
  }

  pub fn get_accounts(&self) -> &AccountsDataservice {
    &self.accounts
  }
}
