use accounts as a;
use actix_rt as rt;
use actix_web::{test, web, App};

#[rt::test]
async fn scenario() {
  let app = test::init_service(App::new().configure(a::api)).await;

  assert_eq!(1, 1);
}
