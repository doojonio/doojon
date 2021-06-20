use crate::Config;

mod schema;

mod dataservices;
use dataservices::Dataservices;
pub use dataservices::{AccountsDataservice, CreatableAccount, ReadableAccount};

pub struct Model {
  pub dataservices: Dataservices,
}

impl Model {
  pub fn new(config: &Config) -> Model {
    let dataservices = Dataservices::new(&config);

    Model { dataservices }
  }
}
