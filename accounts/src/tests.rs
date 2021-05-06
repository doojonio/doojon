use actix_web::{test, App};
use dotenv::dotenv;

use super::{build_dbpool, configure_app};
use crate::model::models::{Account, NewAccount};
use crate::model::service;

#[derive(serde::Serialize)]
struct Credentials {
    email: &'static str,
    password: &'static str,
}

fn delete_account(id: uuid::Uuid) {
    let dbconn = build_dbpool().get().unwrap();
    service::account::delete_by_id(&dbconn, id).unwrap();
}

#[actix_rt::test]
async fn basic() {
    // include .env vars to std env
    dotenv().ok();
    env_logger::init();

    let mut app = test::init_service(App::new().configure(configure_app)).await;

    let creds = Credentials {
        email: "testuser@gmail.com",
        password: "s3cret",
    };

    let new_account = NewAccount {
        email: String::from(creds.email),
        password: String::from(creds.password),
        birthday: Some(chrono::NaiveDate::parse_from_str("12.02.2000", "%d.%m.%Y").unwrap()),
        first_name: Some(String::from("Anton")),
        last_name: Some(String::from("Fedotov")),
    };

    // delete test user if exists
    let req = test::TestRequest::get()
        .uri(format!("/api/account?email={}", creds.email).as_str())
        .to_request();
    let res = test::call_service(&mut app, req).await;

    if res.status().is_success() {
        let account: Account = test::read_body_json(res).await;
        delete_account(account.id);
    }

    // create account
    let req = test::TestRequest::post()
        .uri("/api/account")
        .set_json(&new_account)
        .to_request();
    let res = test::call_service(&mut app, req).await;

    assert!(res.status().is_success());

    // auth with password
    let req = test::TestRequest::post()
        .uri("/api/auth")
        .set_json(&creds)
        .to_request();
    let res = test::call_service(&mut app, req).await;

    assert!(res.status().is_success());
    assert!(res.headers().get("Set-Cookie").is_some());
}
