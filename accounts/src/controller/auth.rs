use actix_identity::Identity;
use actix_web::{web, HttpResponse};
use serde::Deserialize;

use crate::entities::DbPool;
use crate::web_errors::ServiceError;
use crate::model::service::account;

#[derive(Deserialize)]
pub struct EmailWithPassword {
  email: String,
  password: String
}

pub async fn password_auth(
  auth_data: web::Json<EmailWithPassword>,
  pool: web::Data<DbPool>,
  identity: Identity,
) -> Result<HttpResponse, ServiceError> {
  let conn = &pool.get().unwrap();
  let auth_data = auth_data.into_inner();
  let result = account::password_auth(conn, &auth_data.email, &auth_data.password)?;

  match result {
    false => Ok(HttpResponse::Unauthorized().json(false)),
    true => {
      identity.remember(auth_data.email);
      Ok(HttpResponse::Ok().json(true))
    }
  }
}
