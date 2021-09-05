use std::fs::File;
use std::io::Read;
use std::path::PathBuf;

use serde::Deserialize;

#[derive(Deserialize, Clone)]
pub struct Config {
    pub web: WebConfig,
    pub cloud_storage: CloudStorageConfig,
    pub avatars: AvatarsConfig,
}

impl Config {
    pub fn new() -> Self {
        let config_path = std::env::var("PIXEL_CONFIG")
            .map(|path| PathBuf::from(path))
            .unwrap();

        let mut config_content = String::new();

        File::open(config_path.as_path())
            .unwrap()
            .read_to_string(&mut config_content)
            .unwrap();

        toml::from_str(&config_content).unwrap()
    }
}

#[derive(Deserialize, Clone)]
pub struct WebConfig {
    pub server: ServerConfig,
}

#[derive(Deserialize, Clone)]
pub struct ServerConfig {
    pub listen: String,
    pub workers: usize,
    pub max_connections: usize,
}

#[derive(Deserialize, Clone)]
pub struct CloudStorageConfig {
    pub avatars_bucket: String,
    pub avatars_filename_length: usize,
}

#[derive(Deserialize, Clone)]
pub struct AvatarsConfig {
    pub avatar_min_length: u32,
}
