use crate::model::models::{Account, NewAccount};
use diesel::{self, PgConnection};
use diesel::prelude::*;

pub fn create(conn: &PgConnection, account: NewAccount) -> Account {

    use crate::model::schema::accounts::dsl::accounts;
    diesel::insert_into(accounts).values(account).get_result(conn).expect(
        "falied to create account"
    )
}

pub fn read(id: String) {

}