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

#[macro_export]
macro_rules! webapp {
  ($app_pointer:ident) => {
    actix_web::App::new()
      .app_data($app_pointer.clone())
      .wrap(actix_web::middleware::Logger::default())
      .configure(accounts::api)
  };
}
