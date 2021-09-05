use actix_web::{web, App, HttpServer};
use std::{env};

mod config;
mod handlers;
mod services;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    _setup_env();
    let cfg = config::Config::new();
    let cfg_for_factory = cfg.clone();

    HttpServer::new(move || {
        let cfg = web::Data::new(cfg_for_factory.clone());
        App::new()
            .service(
                web::scope("/api/svc/pixel/1/")
                    .route("avatarize", web::post().to(handlers::avatar::avatarize)),
            )
            .app_data(web::Data::new(crate::services::storage::Storage::new(
                cfg.clone(),
            )))
            .app_data(cfg.clone())
    })
    .bind(cfg.web.server.listen)?
    .workers(cfg.web.server.workers)
    .max_connections(cfg.web.server.max_connections)
    .run()
    .await
}

fn _setup_env() {
    let app_home = env!("CARGO_MANIFEST_DIR");
    let cfg_env = "PIXEL_CONFIG";
    let svc_acc_env = "SERVICE_ACCOUNT";

    match env::var(cfg_env) {
        Ok(_) => (),
        Err(_) => env::set_var(cfg_env, [app_home, "Pixel.toml"].join("/")),
    }

    match env::var(svc_acc_env) {
        Ok(_) => (),
        Err(_) => env::set_var(
            svc_acc_env,
            [app_home, "secrets", "gapp-key.json"].join("/"),
        ),
    }
}
