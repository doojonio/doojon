use actix_web::{
  web::{Data, Json, Query},
  HttpResponse, Responder,
};
use serde::Deserialize;

use crate::model::CreatableAccount;
use crate::App;

pub async fn create(app: Data<App>, account: Json<CreatableAccount>) -> impl Responder {
  let accounts_ds = app.model.dataservices.get_accounts();
  let account = accounts_ds.create(account.into_inner());
  HttpResponse::Ok().json(account)
}

pub async fn read(app: Data<App>, q: Query<QueryAccountById>) -> impl Responder {
  let account = app.model.dataservices.get_accounts().read_by_id(q.id);
  HttpResponse::Ok().json(account)
}

#[derive(Deserialize)]
pub struct QueryAccountById {
  id: uuid::Uuid,
}
