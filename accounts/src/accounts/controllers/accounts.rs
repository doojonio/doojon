use crate::model::CreatableAccount;
use crate::App;
use actix_web::{
  web::{Data, Json},
  HttpResponse, Responder,
};

pub async fn create(app: Data<App>, account: Json<CreatableAccount>) -> impl Responder {
  let accounts_ds = app.model.dataservices.get_accounts();
  let account = accounts_ds.create(account.into_inner());
  HttpResponse::Ok().json(account)
}

pub async fn read(app: Data<App>) -> impl Responder {
  HttpResponse::Ok().body(&app.config.database.url)
}
