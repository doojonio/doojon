import { Service } from '../service.js';
import CryptService from './crypt.js';

export default class SessionsService extends Service {
  static get deps() {
    return {
      _redis: '/h/redis',
      _crypt: '/s/crypt',
    };
  }

  constructor(...args) {
    super(...args);
    /**
     * @type {import('redis/dist/lib/client.js').default}
     */
    this._redis;
    /**
     * @type {CryptService}
     */
    this._crypt;
  }

  // TODO
  async create(profileId) {
    const session = this._crypt.generateUUID();
    return this._redis.hSet('sessions2users', session, profileId),
  }
}
