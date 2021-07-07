use crate::model::dataservices::ReadableSessionWithoutAccountId;
use actix_web::cookie::Cookie;

use crate::config::AuthCookieConfig;

pub fn build_auth_cookie<'a>(
  cfg: &'a AuthCookieConfig,
  session: &'a ReadableSessionWithoutAccountId,
) -> Cookie<'a> {
  let now = time::OffsetDateTime::now_utc();
  let expires_after = time::Duration::days(cfg.expires_after_days);
  let expires = now + expires_after;

  let sid = session.id.to_simple().to_string().to_uppercase();

  Cookie::build(&cfg.name, sid)
    .domain(&cfg.domain)
    .secure(cfg.secure)
    .path("/")
    .http_only(cfg.http_only)
    .expires(expires)
    .finish()
}
