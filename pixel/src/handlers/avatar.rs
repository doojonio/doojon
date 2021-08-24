use actix_multipart::Multipart;
use actix_web::{web, Error, HttpResponse};

use futures::{StreamExt, TryStreamExt};

#[derive(serde::Deserialize)]
pub struct QueryCropValues {
  x: u32,
  y: u32,
  width: u32,
  height: u32,
}

pub async fn avatarize(
  payload: Multipart,
  crop: web::Query<QueryCropValues>,
) -> Result<HttpResponse, Error> {
  _check_crop_vals(&crop).or_else(|err| Err(HttpResponse::BadRequest().body(err)))?;

  let bytes = _get_image_bytes(payload)
    .await
    .or_else(|err| Err(HttpResponse::BadRequest().body(err)))?;

  let mut im = image::load_from_memory(&bytes)
    .or_else(|err| {
      Err(HttpResponse::BadRequest().body(format!("error during parsing image: {}", err)))
    })?
    .into_rgb8();

  _check_crop_compared_to_image_vals(im.dimensions(), &crop)
    .or_else(|msg| Err(HttpResponse::BadRequest().body(msg)))?;

  im = image::imageops::crop(&mut im, crop.x, crop.y, crop.width, crop.height).to_image();

  im = image::imageops::resize(&mut im, 300, 300, image::imageops::FilterType::Gaussian);
  im.save("/tmp/test.jpg")
    .or_else(|err| Err(HttpResponse::BadRequest().body(format!("{}", err))))?;

  // Minificated
  im = image::imageops::resize(&mut im, 64, 64, image::imageops::FilterType::Gaussian);
  im.save("/tmp/test.mini.jpg")
    .or_else(|err| Err(HttpResponse::BadRequest().body(format!("{}", err))))?;

  Ok(HttpResponse::from("OK"))
}

fn _check_crop_vals(crop: &QueryCropValues) -> Result<(), &'static str> {
  if crop.width < 300 || crop.height < 300 {
    return Err("width and height should not be lesser then 300");
  }

  if crop.width != crop.height {
    return Err("cropped image shoud be square (height should be equal width)");
  }

  Ok(())
}

fn _check_crop_compared_to_image_vals(
  dimensions: (u32, u32),
  crop: &QueryCropValues,
) -> Result<(), &'static str> {
  if crop.x + crop.width > dimensions.0 {
    return Err("(x + width) is bigger than image width");
  }

  if crop.y + crop.height > dimensions.1 {
    return Err("(y + height) is bigger than image height");
  }

  Ok(())
}

async fn _get_image_bytes(mut payload: Multipart) -> Result<web::BytesMut, &'static str> {
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
      _ => return Err("content-type is not image"),
    };

    let mut bytes = web::BytesMut::new();
    while let Some(chunk) = field.next().await {
      let chunk = chunk.or_else(|_| Err("unable to get one of the image chunks"))?;
      bytes.extend_from_slice(&chunk);
    }

    return Ok(bytes);
  }

  Err("image part of body is missing")
}
