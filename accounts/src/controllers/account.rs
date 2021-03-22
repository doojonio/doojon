use actix_web::{web, HttpResponse};
use serde::{Deserialize};

use crate::entities::DbPool;
use crate::model::models::{NewAccount};
use crate::model::services::account;

#[derive(Deserialize)]
pub struct FormWithId {
    id: uuid::Uuid,
}

pub async fn create(account: web::Json<NewAccount>, pool: web::Data<DbPool>) -> HttpResponse {

    let conn = &pool.get().unwrap();
    let account = account::create(&conn, account.into_inner()).expect("failed to create account");

    HttpResponse::Ok().json(account)
}

pub async fn read(form: web::Query<FormWithId>, pool: web::Data<DbPool>) -> HttpResponse {

    let conn = &pool.get().unwrap();
    let account = match account::read(&conn, form.id) {
        Ok(account) => {
            Some(account)
        },
        Err(_account) => {
            None
        }
    };

    HttpResponse::Ok().json(account)
}