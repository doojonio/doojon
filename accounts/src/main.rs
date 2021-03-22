#[macro_use]
extern crate diesel;

use actix_web::{web, App, HttpServer};
use diesel::PgConnection;
use diesel::r2d2::{self};
use dotenv::dotenv;
use std::env;

mod controllers;
mod entities;
mod model;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // include .env vars to std env
    dotenv().ok();
    let db_conn_manager = setup_db();
    let pool = r2d2::Pool::builder()
        .build(db_conn_manager)
        .expect("r2d2 failed to create pool");

    HttpServer::new(move || {
        App::new()
            .data(pool.clone())
            .service(
                web::scope("/api")
                    .service(
                        web::resource("/account")
                            .route(web::post().to(controllers::account::create))
                            .route(web::get().to(controllers::account::read))
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
