use crate::model::models::{Account, NewAccount};
use crate::model::errors::ServiceError;
use diesel::{self, PgConnection};
use diesel::prelude::*;

pub fn create(conn: &PgConnection, account: NewAccount) -> Result<Account, ServiceError> {

    use crate::model::schema::accounts::dsl::*;
    let created_account = diesel::insert_into(accounts).values(account).returning((id, email, first_name, last_name, birthday)).get_result(conn)?;

    Ok(created_account)
}

pub fn read(conn: &PgConnection, account_id: uuid::Uuid) -> Result<Account, diesel::result::Error> {

    use crate::model::schema::accounts::dsl::*;
    accounts.find(account_id).select((id, email, first_name, last_name, birthday)).first::<Account>(conn)
}