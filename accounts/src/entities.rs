use diesel::r2d2::ConnectionManager;
use diesel::PgConnection;
use r2d2_redis::RedisConnectionManager;

pub type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;
pub type RsPool = r2d2::Pool<RedisConnectionManager>;
