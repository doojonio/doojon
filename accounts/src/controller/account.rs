use actix_web::{web, HttpResponse};
use serde::Deserialize;

use crate::entities::DbPool;
use crate::model::errors::ServiceError;
use crate::model::models::{Account, NewAccount};
use crate::model::service::account;

#[derive(Deserialize)]
pub struct FormWithId {
    id: Option<uuid::Uuid>,
    email: Option<String>,
}

pub async fn create(
    account: web::Json<NewAccount>,
    dbpool: web::Data<DbPool>,
) -> Result<HttpResponse, ServiceError> {
    let conn = &dbpool.get().unwrap();
    let account = account::create(&conn, account.into_inner())?;

    Ok(HttpResponse::Ok().json(account))
}

pub async fn read(
    form: web::Query<FormWithId>,
    dbpool: web::Data<DbPool>,
) -> Result<HttpResponse, ServiceError> {
    let conn = &dbpool.get().unwrap();
    let account: Account;

    if let Some(id) = form.id {
        account = account::read_by_id(&conn, id)?;
    } else if let Some(email) = form.email.clone() {
        account = account::read_by_email(&conn, email)?;
    } else {
        return Ok(HttpResponse::BadRequest().json("No query fields found"));
    }

    Ok(HttpResponse::Ok().json(account))
}
