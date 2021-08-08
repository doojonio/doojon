use actix_web::web::*;

use crate::controllers::*;

pub fn api(cfg: &mut ServiceConfig) {
  cfg
    .service(
      resource("/api/1/accounts")
        .route(get().to(accounts::read))
        .route(post().to(accounts::create)),
    )
    .route(
      "/api/1/accounts/is_email_available",
      get().to(accounts::is_email_available),
    )
    .route("/api/1/auth", post().to(auth::auth))
    .route("/api/1/logout", delete().to(auth::logout))
    .route(
      "/api/1/current_user_account",
      get().to(auth::get_current_user),
    )
    .route("/api/1/health", get().to(healthcheck));

  #[cfg(feature = "test_account_api")]
  cfg.route("/api/1/test_account", post().to(test_account::create));
}

pub async fn healthcheck() -> HttpResponse {
  return HttpResponse::from("OK");
}
