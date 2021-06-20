use crate::model::Model;
use crate::Config;

pub struct App {
  pub config: Config,
  pub model: Model,
}

impl App {
  pub fn new(config: Config) -> Self {
    let model = Model::new(&config);
    App { config, model }
  }
}
