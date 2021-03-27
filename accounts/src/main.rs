#[macro_use]
extern crate diesel;
extern crate env_logger;

use actix_web::{web, App, HttpServer};
use actix_web::middleware::Logger;
use diesel::PgConnection;
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

  let dbpool = diesel::r2d2::Pool::builder()
    .build(setup_db())
    .expect("r2d2 failed to create dbpool");
  let rspool = r2d2_redis::r2d2::Pool::builder()
    .build(setup_redis())
    .expect("r2d2 failed to create rspool");

  HttpServer::new(move || {
    App::new()
      .wrap(Logger::default())
      .data(dbpool.clone())
      .data(rspool.clone())
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
          .service(
            web::resource("/session")
              .route(web::get().to(controller::auth::get_session))
          )
      )
  })
  .bind("127.0.0.1:3000")?
  .run()
  .await
}


fn setup_db() -> diesel::r2d2::ConnectionManager::<PgConnection> {

  let db_uri = env::var("DATABASE_URL").expect("database url is not set");
  diesel::r2d2::ConnectionManager::<PgConnection>::new(db_uri)
}

fn setup_redis() -> r2d2_redis::RedisConnectionManager {
  r2d2_redis::RedisConnectionManager::new(env::var("REDIS_URL").unwrap()).unwrap()
}
