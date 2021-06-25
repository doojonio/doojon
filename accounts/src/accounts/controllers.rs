use actix_web::{HttpResponse, ResponseError};

use crate::model::ServiceError;

pub mod accounts;
pub mod auth;

#[cfg(feature = "test_account_api")]
pub mod test_account;

pub enum ControllerError {
  NotFound,
  Conflict,
  Unauthorized,
}

impl From<ServiceError> for ControllerError {
  fn from(err: ServiceError) -> ControllerError {
    match err {
      ServiceError::NotFound => ControllerError::NotFound,
      ServiceError::UniqueViolation => ControllerError::Conflict,
      ServiceError::Unauthorized => ControllerError::Unauthorized,
    }
  }
}

impl std::fmt::Display for ControllerError {
  fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
    match self {
      ControllerError::NotFound => write!(f, "Not Found"),
      ControllerError::Conflict => write!(f, "Conflict with existing records"),
      ControllerError::Unauthorized => write!(f, "Unauthorized"),
    }
  }
}

impl std::fmt::Debug for ControllerError {
  fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
    (self as &dyn std::fmt::Display).fmt(f)
  }
}

impl ResponseError for ControllerError {
  fn error_response(&self) -> HttpResponse {
    match self {
      ControllerError::NotFound => HttpResponse::NotFound().json("Not found"),
      ControllerError::Conflict => HttpResponse::Conflict().json("Conflict with existing records"),
      ControllerError::Unauthorized => HttpResponse::Unauthorized().json("Unauthorized"),
    }
  }
}
