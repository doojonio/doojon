use actix_web::{
  web::{Data, Json, Query},
  HttpResponse,
};
use serde::Deserialize;

use super::ControllerError;
use crate::model::dataservices::CreatableAccount;
use crate::App;

pub async fn create(
  app: Data<App>,
  account: Json<CreatableAccount>,
) -> Result<HttpResponse, ControllerError> {
  let account = app
    .model
    .dataservices
    .accounts
    .create(account.into_inner())?;
  Ok(HttpResponse::Ok().json(account))
}

pub async fn read(
  app: Data<App>,
  q: Query<QueryAccountById>,
) -> Result<HttpResponse, ControllerError> {
  let account = app.model.dataservices.accounts.read_by_id(q.id)?;
  Ok(HttpResponse::Ok().json(account))
}

#[derive(Deserialize)]
pub struct QueryAccountById {
  id: uuid::Uuid,
}
