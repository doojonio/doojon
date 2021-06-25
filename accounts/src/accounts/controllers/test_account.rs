use crate::controllers::ControllerError;
use crate::App;

use actix_web::{
  cookie::Cookie,
  web::{Data, Json},
  HttpMessage, HttpRequest, HttpResponse,
};

pub async fn create(app: Data<App>) -> Result<HttpResponse, ControllerError> {
  let account = app.model.services.test_account.new_test_account().await;
  Ok(HttpResponse::Ok().json(account))
}
