use actix_web::web::*;

pub fn api(cfg: &mut ServiceConfig) {
  cfg.service(
    resource("/api/1/accounts")
      .route(get().to(crate::controllers::accounts::read))
      .route(post().to(crate::controllers::accounts::create)),
  );
}
