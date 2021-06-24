use crate::Config;

mod schema;

pub mod dataservices;
use dataservices::Dataservices;

mod services;
use services::Services;

mod service_errors;
pub use service_errors::ServiceError;

pub struct Model {
  pub dataservices: Dataservices,
  pub services: Services,
}

impl Model {
  pub fn new(config: &Config) -> Model {
    let dataservices = Dataservices::new(&config);
    let services = Services::new(&dataservices);

    Model {
      dataservices,
      services,
    }
  }
}
