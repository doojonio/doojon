#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;
extern crate env_logger;

use actix_web::middleware::Logger;
use actix_web::{web, App, HttpServer};
use diesel::PgConnection;
use dotenv::dotenv;
use std::env;

mod controller;
mod entities;
mod model;
mod web_errors;

#[cfg(test)]
mod tests;

embed_migrations!();

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // include .env vars to std env
    dotenv().ok();
    env_logger::init();

    HttpServer::new(move || App::new().wrap(Logger::default()).configure(configure_app))
        .bind("0.0.0.0:3000")?
        .run()
        .await
}

fn configure_app(cfg: &mut web::ServiceConfig) {
    let dbpool = build_dbpool();
    let rspool = build_rspool();

    embedded_migrations::run(&dbpool.get().unwrap()).unwrap();

    cfg.data(dbpool.clone()).data(rspool.clone()).service(
        web::scope("/api")
            .service(
                web::resource("/account")
                    .route(web::post().to(controller::account::create))
                    .route(web::get().to(controller::account::read)),
            )
            .service(web::resource("/auth").route(web::post().to(controller::auth::password_auth)))
            .service(web::resource("/session").route(web::get().to(controller::auth::get_session)))
            .service(web::resource("/logout").route(web::delete().to(controller::auth::logout))),
    );
}

fn build_dbpool() -> entities::DbPool {
    let db_uri = env::var("DATABASE_URL").expect("database url is not set");
    diesel::r2d2::Pool::builder()
        .build(diesel::r2d2::ConnectionManager::<PgConnection>::new(db_uri))
        .expect("r2d2 failed to create dbpool")
}

fn build_rspool() -> r2d2::Pool<r2d2_redis::RedisConnectionManager> {
    r2d2_redis::r2d2::Pool::builder()
        .build(r2d2_redis::RedisConnectionManager::new(env::var("REDIS_URL").unwrap()).unwrap())
        .expect("r2d2 failed to create rspool")
}
