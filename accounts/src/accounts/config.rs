use serde::Deserialize;
use std::env;
use std::fmt::Debug;
use std::fs::File;
use std::io::Read;
use std::path::PathBuf;
use toml;

#[derive(Deserialize, Debug, Clone)]
pub struct Config {
  pub database: DatabaseConfig,
  pub redis: RedisConfig,
  pub web: WebConfig,
}

impl Config {
  pub fn new() -> Self {
    let config_path: PathBuf = [env!("CARGO_MANIFEST_DIR"), "Accounts.toml"]
      .iter()
      .collect();

    let mut config_content = String::new();

    File::open(config_path.as_path())
      .unwrap()
      .read_to_string(&mut config_content)
      .unwrap();

    toml::from_str(&config_content).unwrap()
  }
}

#[derive(Deserialize, Debug, Clone)]
pub struct DatabaseConfig {
  pub url: String,
}

#[derive(Deserialize, Debug, Clone)]
pub struct RedisConfig {
  pub url: String,
}

#[derive(Deserialize, Debug, Clone)]
pub struct WebConfig {
  pub listen: String,
  pub domain: String,
  pub secure: bool,
}
