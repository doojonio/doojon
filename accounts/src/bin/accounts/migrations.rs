use accounts::Config;
use clap::{App, Arg, ArgMatches};
use std::process::Command;

#[cfg(debug_assertions)]
pub fn subcommand() -> App<'static, 'static> {
  App::new("migrations")
    .about("manage database migrations")
    .subcommand(subcommand_generate())
    .subcommand(subcommand_run())
    .subcommand(subcommand_redo())
}
#[cfg(not(debug_assertions))]
pub fn subcommand() -> App<'static, 'static> {
  App::new("migrations")
    .about("manage database migrations")
    .subcommand(subcommand_generate())
    .subcommand(subcommand_run())
}

pub fn run(matches: &ArgMatches, config: Config) {
  if let Some(ref matches) = matches.subcommand_matches("generate") {
    return run_generate(matches);
  }

  if let Some(_) = matches.subcommand_matches("run") {
    return run_run(config);
  }

  #[cfg(debug_assertions)]
  if let Some(_) = matches.subcommand_matches("redo") {
    return run_redo(config);
  }
}

pub fn subcommand_generate() -> App<'static, 'static> {
  App::new("generate")
    .about("generate migration files")
    .arg(Arg::with_name("name").required(true).index(1))
}

pub fn run_generate(matches: &ArgMatches) {
  let name = matches.value_of("name").unwrap();

  Command::new("diesel")
    .arg("migration")
    .arg("generate")
    .arg(name)
    .spawn()
    .unwrap();
}

pub fn subcommand_run() -> App<'static, 'static> {
  App::new("run").about("run migration and update schema.rs")
}

pub fn run_run(config: Config) {
  Command::new("diesel")
    .arg("migration")
    .arg("run")
    .arg("--database-url")
    .arg(&config.database.url)
    .spawn()
    .unwrap();
}

#[cfg(debug_assertions)]
pub fn subcommand_redo() -> App<'static, 'static> {
  App::new("redo").about("redo latest migration")
}

#[cfg(debug_assertions)]
pub fn run_redo(config: Config) {
  Command::new("diesel")
    .arg("migration")
    .arg("redo")
    .arg("--database-url")
    .arg(&config.database.url)
    .spawn()
    .unwrap();
}
