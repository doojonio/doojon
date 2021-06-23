pub enum ServiceError {
  NotFound,
  UniqueViolation,
  Unauthorized,
}

impl From<diesel::result::Error> for ServiceError {
  fn from(error: diesel::result::Error) -> Self {
    match error {
      diesel::result::Error::NotFound => ServiceError::NotFound,
      diesel::result::Error::DatabaseError(kind, info) => _db_error_to_service_error(kind, info),
      _ => panic!("{}", error),
    }
  }
}

fn _db_error_to_service_error(
  kind: diesel::result::DatabaseErrorKind,
  info: Box<dyn diesel::result::DatabaseErrorInformation + Send + Sync>,
) -> ServiceError {
  match kind {
    diesel::result::DatabaseErrorKind::UniqueViolation => ServiceError::UniqueViolation,
    _ => panic!("{}", info.message()),
  }
}

impl std::fmt::Display for ServiceError {
  fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
    match self {
      ServiceError::NotFound => write!(f, "Not Found"),
      ServiceError::UniqueViolation => write!(f, "Unique Violation"),
      ServiceError::Unauthorized => write!(f, "Unauthorized"),
    }
  }
}

impl std::fmt::Debug for ServiceError {
  fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
    (self as &dyn std::fmt::Display).fmt(f)
  }
}
