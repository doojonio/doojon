use actix_web::{
  web::{Data, Json, Query},
  HttpResponse,
};
use serde::Deserialize;

use super::ControllerError;
use crate::model::dataservices::CreatableAccount;
use crate::{helpers, App};

pub async fn create(
  app: Data<App>,
  account: Json<CreatableAccount>,
  config: Query<QueryCreateAccountConfig>,
) -> Result<HttpResponse, ControllerError> {
  let account = app
    .model
    .dataservices
    .accounts
    .create(account.into_inner())?;

  let need_authorization = config.authorize;

  if need_authorization != Some(true) {
    return Ok(HttpResponse::Ok().json(account));
  }

  let session = app.model.dataservices.sessions.create(&account.id)?;
  let auth_cookie_cfg = &app.config.web.auth_cookie;

  let cookie = helpers::build_auth_cookie(auth_cookie_cfg, &session);

  Ok(HttpResponse::Ok().cookie(cookie).json(account))
}

pub async fn read(
  app: Data<App>,
  q: Query<QueryAccountById>,
) -> Result<HttpResponse, ControllerError> {
  let account = app.model.dataservices.accounts.read_by_id(q.id)?;
  Ok(HttpResponse::Ok().json(account))
}

pub async fn is_email_available(
  app: Data<App>,
  q: Query<QueryEmail>,
) -> Result<HttpResponse, ControllerError> {
  let is_uniq = app.model.dataservices.accounts.is_email_uniq(&q.email)?;

  Ok(HttpResponse::Ok().json(is_uniq))
}

#[derive(Deserialize)]
pub struct QueryAccountById {
  id: uuid::Uuid,
}

#[derive(Deserialize)]
pub struct QueryCreateAccountConfig {
  authorize: Option<bool>,
}

#[derive(Deserialize)]
pub struct QueryEmail {
  pub email: String,
}
