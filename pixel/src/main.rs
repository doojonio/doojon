use actix_web::{web, App, HttpServer};

mod config;
mod handlers;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let cfg = config::Config::new();

    HttpServer::new(|| {
        App::new().route(
            "/api/svc/pixel/1/avatarize",
            web::post().to(handlers::avatar::avatarize),
        )
    })
    .bind(cfg.web.server.listen)?
    .workers(cfg.web.server.workers)
    .max_connections(cfg.web.server.max_connections)
    .run()
    .await
}
