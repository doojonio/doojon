use actix_web::{web, App, HttpServer};

pub fn subcommand() -> clap::App<'static, 'static> {
  clap::App::new("server").about("start accounts server")
}

pub async fn run(app: accounts::App) -> std::io::Result<()> {
  let listen = app.config.web.listen.clone();
  let app_pointer = web::Data::new(app);

  HttpServer::new(move || {
    App::new()
      .app_data(app_pointer.clone())
      .configure(accounts::api)
  })
  .bind(listen)?
  .run()
  .await
}
