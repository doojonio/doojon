use actix_web::{web, App, HttpServer};

pub fn subcommand() -> clap::App<'static, 'static> {
  clap::App::new("server").about("start accounts server")
}

pub async fn run(app: accounts::App) -> std::io::Result<()> {
  let conf = &app.config.web.server;

  let listen = conf.listen.clone();
  let workers = conf.workers;
  let max_connections = conf.max_connections;

  let app_pointer = web::Data::new(app);

  HttpServer::new(move || {
    App::new()
      .app_data(app_pointer.clone())
      .configure(accounts::api)
  })
  .bind(listen)?
  .workers(workers)
  .max_connections(max_connections)
  .run()
  .await
}
