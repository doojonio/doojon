use actix_web::{cookie::Cookie, web, HttpMessage, HttpResponse};
use r2d2_redis::redis::Commands;
use rand::{distributions::Alphanumeric, thread_rng, Rng};
use serde::Deserialize;

use crate::entities::{DbPool, RsPool};
use crate::model::service::account;
use crate::web_errors::ServiceError;

#[derive(Deserialize)]
pub struct EmailWithPassword {
    email: String,
    password: String,
}

pub async fn get_session(
    req: web::HttpRequest,
    dbpool: web::Data<DbPool>,
    rspool: web::Data<RsPool>,
) -> Result<HttpResponse, ServiceError> {
    let headers = req.headers();
    let session: &str = match headers.get("X-Session") {
        Some(session_in_header) => session_in_header.to_str().unwrap(),
        None => return Ok(HttpResponse::BadRequest().json("X-Session header not found")),
    };
    let id: Option<String> = rspool.get().unwrap().hget("sessions", session).unwrap();
    let id = match id {
        Some(found_uuid) => found_uuid,
        None => return Ok(HttpResponse::NotFound().json("Session not found")),
    };

    let id = uuid::Uuid::parse_str(id.as_str()).unwrap();
    let account = account::read_by_id(&dbpool.get().unwrap(), id)?;

    Ok(HttpResponse::Ok().json(account))
}

pub async fn logout(req: web::HttpRequest, rspool: web::Data<RsPool>) -> HttpResponse {
    let mut rsconn = rspool.get().unwrap();
    let cookie = req.cookie("auth");

    let cookie = match cookie {
        None => return HttpResponse::Unauthorized().json("Not logged in"),
        Some(session) => session,
    };

    let _: () = rsconn.hdel("sessions", cookie.value()).unwrap();

    HttpResponse::Ok()
        .del_cookie(&Cookie::named("auth"))
        .json("Done")
}

pub async fn password_auth(
    auth_data: web::Json<EmailWithPassword>,
    dbpool: web::Data<DbPool>,
    rspool: web::Data<RsPool>,
) -> Result<HttpResponse, ServiceError> {
    let dbconn = &dbpool.get().unwrap();
    let mut rsconn = rspool.get().unwrap();

    let auth_data = auth_data.into_inner();

    let id = account::password_auth(dbconn, &auth_data.email, &auth_data.password)?;

    let new_session = generate_session().await;
    let _: () = rsconn
        .hset("sessions", &new_session, id.to_hyphenated().to_string())
        .unwrap();

    let cookie = Cookie::build("auth", new_session)
        .domain(std::env::var("AUTH_COOKIE_DOMAIN").unwrap())
        .path("/")
        .secure(match std::env::var("COOKIE_SECURE").unwrap().as_str() {
            "1" => true,
            _ => false,
        })
        .finish();

    Ok(HttpResponse::Ok().cookie(cookie).json(true))
}

pub async fn generate_session() -> String {
    thread_rng()
        .sample_iter(&Alphanumeric)
        .take(30)
        .map(char::from)
        .collect()
}
