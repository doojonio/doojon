use crate::controllers::ControllerError;
use crate::App;

use actix_web::{cookie::Cookie, web::Data, HttpResponse};

pub async fn create(app: Data<App>) -> Result<HttpResponse, ControllerError> {
  let account = app.model.services.test_account.new_test_account().await;

  let sid = app.model.dataservices.sessions.create(&account.id).unwrap();

  let cfg = &app.config.web.auth_cookie;
  let auth_cookie = Cookie::build(&cfg.name, sid.id.to_simple().to_string().to_uppercase())
    .domain(&cfg.domain)
    .secure(cfg.secure)
    .path("/")
    .http_only(cfg.http_only)
    .finish();

  Ok(HttpResponse::Ok().cookie(auth_cookie).json(account))
}
