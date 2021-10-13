import { Service } from '../service.js';
import CryptService from './crypt.js';

export default class SessionsService extends Service {
  static get deps() {
    return {
      _config: '/conf',
      _redis: '/h/redis',
      _crypt: '/s/crypt',
    };
  }

  constructor(...args) {
    super(...args);

    this._prefix = {
      sessions: this._config.services.sessions.sessionsRedisPrefix,
      profilesToSessions: this._config.services.sessions.profilesToSessionsRedisPrefix,
    };

    /**
     * @type {import('redis/dist/lib/client.js').default}
     */
    this._redis;
    /**
     * @type {CryptService}
     */
    this._crypt;
  }

  async create(state, profileId) {
    const sessionId = this._crypt.generateUUID();
    const sessionKey = `${this._prefix.sessions}:${sessionId}`;
    const profileSessionsKey = `${this._prefix.profilesToSessions}:${profileId}`;

    const nowTime = (new Date()).toUTCString();
    const ip = state.identity.ip;

    const sessionValue = {
      profileId,
      created: nowTime,
      lastTimeUsed: nowTime,
      lastTimeUsedBy: ip,
    };

    await this._redis.multi().hSet(sessionKey, sessionValue).rPush(profileSessionsKey, sessionKey).exec();

    return sessionId;
  }
}
