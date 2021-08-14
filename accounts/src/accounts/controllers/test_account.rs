use crate::controllers::ControllerError;
use crate::App;

use actix_web::{web::Data, HttpResponse};

pub async fn create(app: Data<App>) -> Result<HttpResponse, ControllerError> {
  let account = app.model.services.test_account.new_test_account().await;

  let sid = app.model.dataservices.sessions.create(&account.id).unwrap();

  let cfg = &app.config.web.auth_cookie;
  let auth_cookie = crate::helpers::build_auth_cookie(cfg, &sid);

  Ok(HttpResponse::Ok().cookie(auth_cookie).json(account))
}
