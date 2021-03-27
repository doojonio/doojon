use actix_web::{error::ResponseError, HttpResponse};

pub use crate::model::errors::ServiceError;

impl ResponseError for ServiceError {
  fn error_response(&self) -> HttpResponse {
    match self {
      ServiceError::NotFound => HttpResponse::NotFound().json("Not found"),
      ServiceError::UniqueViolation => HttpResponse::BadRequest().json("Field already taken"),
      ServiceError::Unauthorized => HttpResponse::Unauthorized().json("Unauthorized")
    }
  }
}
