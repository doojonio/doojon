#[macro_use]
extern crate diesel;
extern crate env_logger;

use actix_web::{web, App, HttpServer};
use actix_web::middleware::Logger;
use actix_identity::{CookieIdentityPolicy, IdentityService};
use diesel::PgConnection;
use diesel::r2d2::{self};
use dotenv::dotenv;
use std::env;

mod controller;
mod entities;
mod model;
mod web_errors;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
  // include .env vars to std env
  dotenv().ok();
  env_logger::init();

  let db_conn_manager = setup_db();
  let pool = r2d2::Pool::builder()
    .build(db_conn_manager)
    .expect("r2d2 failed to create pool");

  HttpServer::new(move || {
    App::new()
      .wrap(Logger::default())
      .wrap(IdentityService::new(
        CookieIdentityPolicy::new(env::var("SECRET").expect("SECRET is not specified").as_bytes())
          .name("auth")
          .path("/")
          .domain("localhost")
          .max_age(86400)
          .secure(true)
      ))
      .data(pool.clone())
      .service(
        web::scope("/api")
          .service(
            web::resource("/account")
              .route(web::post().to(controller::account::create))
              .route(web::get().to(controller::account::read))
          )
          .service(
            web::resource("/auth")
              .route(web::post().to(controller::auth::password_auth))
          )
      )
  })
  .bind("127.0.0.1:3000")?
  .run()
  .await
}


fn setup_db() -> diesel::r2d2::ConnectionManager::<PgConnection> {

  let db_uri = env::var("DATABASE_URL").expect("database url is not set");
  r2d2::ConnectionManager::<PgConnection>::new(db_uri)
}
