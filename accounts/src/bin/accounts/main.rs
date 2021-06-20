use actix_web as aweb;

mod migrations;
mod server;

#[aweb::main]
async fn main() {
  let matches = clap::App::new("Accounts CLI")
    .subcommand(server::subcommand())
    .subcommand(migrations::subcommand())
    .get_matches();

  let config = accounts::Config::new();

  if let Some(ref matches) = matches.subcommand_matches("migrations") {
    return migrations::run(matches, config);
  }

  let app = accounts::App::new(config);
  if let Some(_) = matches.subcommand_matches("server") {
    return match server::run(app).await {
      Ok(_) => (),
      Err(_) => eprintln!("Unable to start server"),
    };
  }

  return;
}
