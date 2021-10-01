import { Service } from '../service.js';
import { IdStatus } from '../state.js';

/**
 * @typedef {import('../dataservices/profiles.js').default} ProfilesDataservice
 * @typedef {import('../state.js').UserInfo} UserInfo
 */

export default class IdService extends Service {
  /**
   * @type {ProfilesDataservice}
   */
  _profiles;

  static get deps() {
    return {
      _profiles: '/ds/profiles',
    };
  }

  /**
   *
   * @param {string} sessionId
   * @returns {Promise<UserInfo>}
   */
  async getIdentityBySessionId(sessionId) {
    if (!sessionId) {
      return { status: IdStatus.UNAUTHORIZED };
    }

    return { status: IdStatus.AUTHORIZED };
  }
}
