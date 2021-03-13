use actix_web::{web, Responder, HttpResponse};
use crate::entities::DbPool;
use crate::model::services::account;
use crate::model::models::{NewAccount, Account};

pub async fn create(pool: web::Data<DbPool>) -> HttpResponse {

    let conn = &pool.get().unwrap();
    let acc = NewAccount {
        username: String::from("Hello"),
        password: String::from("world"),
        email: String::from("hello@email.com"),
    };
    let account = account::create(&conn, acc);

    HttpResponse::Ok().json(account)
}