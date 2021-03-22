use crate::model::models::{Account, NewAccount};
use diesel::{self, PgConnection};
use diesel::prelude::*;

pub fn create(conn: &PgConnection, account: NewAccount) -> Result<Account, diesel::result::Error> {

    use crate::model::schema::accounts::dsl::*;
    diesel::insert_into(accounts).values(account).returning((id, email, first_name, last_name, birthday)).get_result(conn)
}

pub fn read(conn: &PgConnection, account_id: uuid::Uuid) -> Result<Account, diesel::result::Error> {

    use crate::model::schema::accounts::dsl::*;
    accounts.find(account_id).select((id, email, first_name, last_name, birthday)).first::<Account>(conn)
}