use accounts::{webapp, App, Config};
use actix_rt as rt;
use actix_web::{test, web::Data};

#[macro_use]
macro_rules! testapp {
  () => {
    let app_pointer = Data::new(App::new(Config::new()));
    let app = test::init_service(webapp!(app_pointer)).await;
  };
}

#[rt::test]
async fn create_account() {
  testapp!();

  assert_eq!(1, 1);
}
