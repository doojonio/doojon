use std::fs::File;
use std::io::Read;
use std::path::PathBuf;

#[derive(serde::Deserialize)]
pub struct Config {
  pub web: WebConfig,
}

impl Config {
  pub fn new() -> Self {
    let config_path: PathBuf = [env!("CARGO_MANIFEST_DIR"), "Pixel.toml"].iter().collect();

    let mut config_content = String::new();

    File::open(config_path.as_path())
      .unwrap()
      .read_to_string(&mut config_content)
      .unwrap();

    toml::from_str(&config_content).unwrap()
  }
}

#[derive(serde::Deserialize)]
pub struct WebConfig {
  pub server: ServerConfig,
}

#[derive(serde::Deserialize)]
pub struct ServerConfig {
  pub listen: String,
  pub workers: usize,
  pub max_connections: usize,
}
