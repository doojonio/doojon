use chrono::prelude::*;
use diesel::prelude::*;
use serde::Serialize;
use std::sync::Arc;

use super::DatabaseConnectionPool;
use crate::model::schema::sessions;
use crate::model::ServiceError;

pub struct SessionsDataservice {
  _pool: Arc<DatabaseConnectionPool>,
}

impl SessionsDataservice {
  pub fn new(pool: Arc<DatabaseConnectionPool>) -> Self {
    SessionsDataservice { _pool: pool }
  }

  pub fn create(
    &self,
    acc_id: uuid::Uuid,
  ) -> Result<ReadableSessionWithoutAccountId, ServiceError> {
    use self::sessions::dsl::*;
    Ok(
      diesel::insert_into(sessions)
        .values(CreatableSession { account_id: acc_id })
        .returning((id, create_time))
        .get_result(&self._pool.get().unwrap())?,
    )
  }

  pub fn read_by_id(
    &self,
    session_id: uuid::Uuid,
  ) -> Result<ReadableSessionWithoutId, ServiceError> {
    use self::sessions::dsl::*;
    Ok(
      sessions
        .filter(id.eq(session_id))
        .select((account_id, create_time))
        .first(&self._pool.get().unwrap())?,
    )
  }

  pub fn read_by_account_id(
    &self,
    acc_id: uuid::Uuid,
  ) -> Result<Vec<ReadableSessionWithoutAccountId>, ServiceError> {
    use self::sessions::dsl::*;
    Ok(
      sessions
        .filter(account_id.eq(acc_id))
        .select((id, create_time))
        .load(&self._pool.get().unwrap())
        .unwrap(),
    )
  }

  pub fn delete_by_id(&self, sid: uuid::Uuid) -> Result<(), ServiceError> {
    use self::sessions::dsl::*;

    diesel::delete(sessions)
      .filter(id.eq(sid))
      .execute(&self._pool.get().unwrap())?;

    Ok(())
  }
}

#[derive(Insertable)]
#[table_name = "sessions"]
pub struct CreatableSession {
  pub account_id: uuid::Uuid,
}

#[derive(Queryable, Serialize)]
pub struct ReadableSessionWithoutId {
  pub account_id: uuid::Uuid,
  pub create_time: DateTime<Utc>,
}

#[derive(Queryable, Serialize)]
pub struct ReadableSessionWithoutAccountId {
  pub id: uuid::Uuid,
  pub create_time: DateTime<Utc>,
}
