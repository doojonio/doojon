use accounts::webapp;
use actix_web::middleware::Logger;
use actix_web::{web, App, HttpServer};

pub fn subcommand() -> clap::App<'static, 'static> {
  clap::App::new("server").about("start accounts server").arg(
    clap::Arg::with_name("with-migrations")
      .long("with-migrations")
      .help("Run migrations before server start"),
  )
}

pub async fn run(app: accounts::App, matches: &clap::ArgMatches<'static>) -> std::io::Result<()> {
  if matches.is_present("with-migrations") {
    app.model.dataservices.run_embedded_migrations();
  }

  let conf = &app.config.web.server;

  let listen = conf.listen.clone();
  let workers = conf.workers;
  let max_connections = conf.max_connections;

  let app_pointer = web::Data::new(app);

  HttpServer::new(move || webapp!(app_pointer))
    .bind(listen)?
    .workers(workers)
    .max_connections(max_connections)
    .run()
    .await
}
