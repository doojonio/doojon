use diesel::result::{DatabaseErrorKind, Error as DbError};
use std::fmt;

#[derive(Debug)]
pub enum ServiceError {
    NotFound,
    UniqueViolation,
}

impl fmt::Display for ServiceError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
       match *self {
           ServiceError::NotFound => write!(f, "Not found"),
           ServiceError::UniqueViolation => write!(f, "Record already exists")
       }
    }
}

impl From<DbError> for ServiceError {
    fn from(db_error: DbError) -> ServiceError {
        match db_error {
            DbError::DatabaseError(kind, info) => match kind {
                DatabaseErrorKind::UniqueViolation => {
                    ServiceError::UniqueViolation
                },
                _ => {panic!("database error {}", info.message())}
            },
            DbError::NotFound => {ServiceError::NotFound},
            _ => {panic!("database error {}", db_error)}
        }
    }
}

