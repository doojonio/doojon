use actix_web::{web, HttpResponse};
use serde::{Deserialize};

use crate::entities::DbPool;
use crate::model::models::{NewAccount};
use crate::model::errors::ServiceError;
use crate::model::service::account;

#[derive(Deserialize)]
pub struct FormWithId {
    id: uuid::Uuid,
}

pub async fn create(account: web::Json<NewAccount>, pool: web::Data<DbPool>) -> Result<HttpResponse, ServiceError> {

    let conn = &pool.get().unwrap();
    let account = account::create(&conn, account.into_inner())?;

    Ok(HttpResponse::Ok().json(account))
}

pub async fn read(form: web::Query<FormWithId>, pool: web::Data<DbPool>) -> Result<HttpResponse, ServiceError> {

    let conn = &pool.get().unwrap();
    let account = account::read(&conn, form.id)?;

    Ok(HttpResponse::Ok().json(account))
}