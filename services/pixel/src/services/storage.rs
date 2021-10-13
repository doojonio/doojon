use actix_web::web::Data;
use cloud_storage as s;
use rand::distributions::Alphanumeric;
use rand::{thread_rng, Rng};

use crate::config::Config;

#[derive(serde::Serialize)]
pub struct ObjectPresentation {
    bucket: String,
    name: String,
}

pub struct Storage {
    config: Data<Config>,
}

impl Storage {
    pub fn new(config: Data<Config>) -> Self {
        Self { config }
    }

    pub async fn upload_avatar_jpeg(&self, avatar: Vec<u8>) -> Result<ObjectPresentation, String> {
        let client = s::Client::default();

        let filename = thread_rng()
            .sample_iter(&Alphanumeric)
            .take(self.config.cloud_storage.avatars_filename_length)
            .map(char::from)
            .collect::<String>()
            + ".jpeg";

        let object = client
            .object()
            .create(
                &self.config.cloud_storage.avatars_bucket,
                avatar,
                filename.as_str(),
                "image/jpeg",
            )
            .await
            .map_err(|e| format!("unable to upload object to cloud storage: {}", e))?;

        Ok(ObjectPresentation {
            name: filename,
            bucket: object.bucket,
        })
    }
}
