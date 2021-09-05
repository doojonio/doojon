use actix_multipart::Multipart;
use actix_web::{self as aweb, web, HttpResponse};

use crate::{
    config::Config,
    services::storage::{self, Storage},
};

use futures::{StreamExt, TryStreamExt};

#[derive(serde::Deserialize)]
pub struct QueryCropValues {
    x: u32,
    y: u32,
    length: u32,
}

#[derive(serde::Serialize)]
pub struct ResponseAvatarUrls {
    full: storage::ObjectPresentation,
    mini: storage::ObjectPresentation,
}

pub async fn avatarize(
    payload: Multipart,
    crop: web::Query<QueryCropValues>,
    storage: web::Data<Storage>,
    config: web::Data<Config>,
) -> Result<HttpResponse, aweb::Error> {
    if crop.length < config.avatars.avatar_min_length {
        Err(aweb::error::ErrorBadRequest(format!(
            "length of the crop square should not be lesser then {}",
            config.avatars.avatar_min_length
        )))?;
    }

    let bytes = _get_image_bytes(payload)
        .await
        .map_err(aweb::error::ErrorBadRequest)?;

    let mut im = image::load_from_memory(&bytes)
        .map_err(aweb::error::ErrorInternalServerError)?
        .into_rgb8();

    _check_crop_compared_to_image_vals(im.dimensions(), &crop)
        .map_err(aweb::error::ErrorBadRequest)?;

    im = image::imageops::crop(&mut im, crop.x, crop.y, crop.length, crop.length).to_image();
    im = image::imageops::resize(&mut im, 300, 300, image::imageops::FilterType::Gaussian);

    let mut buf = Vec::<u8>::new();
    let mut encoder = image::jpeg::JpegEncoder::new(&mut buf);
    encoder
        .encode_image(&im)
        .map_err(aweb::error::ErrorInternalServerError)?;

    let full_obj = storage
        .upload_avatar_jpeg(buf)
        .await
        .map_err(aweb::error::ErrorInternalServerError)?;

    // Minificated
    im = image::imageops::resize(&mut im, 64, 64, image::imageops::FilterType::Gaussian);
    let mut buf = Vec::<u8>::new();
    let mut encoder = image::jpeg::JpegEncoder::new(&mut buf);
    encoder
        .encode_image(&im)
        .map_err(aweb::error::ErrorInternalServerError)?;

    let mini_obj = storage
        .upload_avatar_jpeg(buf)
        .await
        .map_err(aweb::error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(ResponseAvatarUrls {
        mini: mini_obj,
        full: full_obj,
    }))
}

fn _check_crop_compared_to_image_vals(
    dimensions: (u32, u32),
    crop: &QueryCropValues,
) -> Result<(), &'static str> {
    if crop.x + crop.length > dimensions.0 {
        Err("(x + width) is bigger than image width")?;
    }

    if crop.y + crop.length > dimensions.1 {
        Err("(y + height) is bigger than image height")?;
    }

    Ok(())
}

async fn _get_image_bytes(mut payload: Multipart) -> Result<web::BytesMut, String> {
    while let Ok(Some(mut field)) = payload.try_next().await {
        let content_disposition = match field.content_disposition() {
            Some(d) => d,
            None => continue,
        };
        let partname = match content_disposition.get_name() {
            Some(p) => p,
            None => continue,
        };

        if partname != "image" {
            continue;
        }

        match field.content_type().type_() {
            mime::IMAGE => 1,
            _other => Err("content-type is not image")?,
        };

        let mut bytes = web::BytesMut::new();
        while let Some(chunk) = field.next().await {
            let chunk =
                chunk.map_err(|e| format!("unable to get one of the image chunks: {}", e))?;
            bytes.extend_from_slice(&chunk);
        }

        return Ok(bytes);
    }

    Err("image part of body is missing")?
}
