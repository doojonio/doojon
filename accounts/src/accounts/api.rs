use actix_web::web::*;

use crate::controllers::*;

pub fn api(cfg: &mut ServiceConfig) {
  cfg
    .service(
      resource("/api/1/accounts")
        .route(get().to(accounts::read))
        .route(post().to(accounts::create)),
    )
    .route("/api/1/auth", post().to(auth::auth))
    .route("/api/1/logout", delete().to(auth::logout))
    .route("/api/1/current_user", get().to(auth::get_current_user));
}
