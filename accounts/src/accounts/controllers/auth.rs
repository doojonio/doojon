use actix_web::{
  web::{Data, Json},
  HttpMessage, HttpRequest, HttpResponse,
};
use serde::Deserialize;

use super::ControllerError;
use crate::helpers;
use crate::App;

pub async fn auth(
  app: Data<App>,
  creds: Json<AuthPasswordCreds>,
) -> Result<HttpResponse, ControllerError> {
  let session = app
    .model
    .services
    .auth
    .auth_using_password(&creds.email, &creds.password)?;

  let cfg = &app.config.web.auth_cookie;

  let auth_cookie = helpers::build_auth_cookie(cfg, &session);

  Ok(HttpResponse::Ok().cookie(auth_cookie).finish())
}

pub async fn get_current_user(
  app: Data<App>,
  req: HttpRequest,
) -> Result<HttpResponse, ControllerError> {
  let auth_cookie = req.cookie(app.config.web.auth_cookie.name.as_str());

  if auth_cookie.is_none() {
    return Err(ControllerError::Unauthorized);
  }

  let auth_cookie = auth_cookie.unwrap();
  let sid = auth_cookie.value();

  let sid = uuid::Uuid::parse_str(sid);

  if sid.is_err() {
    return Ok(HttpResponse::BadRequest().finish());
  }

  let sid = sid.unwrap();

  let account = app.model.dataservices.accounts.read_account_by_sid(sid);

  if account.is_err() {
    return Err(ControllerError::Unauthorized);
  }

  Ok(HttpResponse::Ok().json(account.unwrap()))
}

pub async fn logout(app: Data<App>, req: HttpRequest) -> Result<HttpResponse, ControllerError> {
  let auth_cookie = req.cookie(app.config.web.auth_cookie.name.as_str());

  if auth_cookie.is_none() {
    return Ok(HttpResponse::Ok().finish());
  }

  let auth_cookie = auth_cookie.unwrap();
  let sid = auth_cookie.value();

  let sid = uuid::Uuid::parse_str(sid);

  if sid.is_err() {
    return Ok(HttpResponse::BadRequest().finish());
  }

  let sid = sid.unwrap();

  app.model.dataservices.sessions.delete_by_id(sid)?;

  Ok(HttpResponse::Ok().del_cookie(&auth_cookie).finish())
}

#[derive(Deserialize)]
pub struct AuthPasswordCreds {
  pub email: String,
  pub password: String,
}
