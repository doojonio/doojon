import { Service } from '../service.js';
import { IdStatus } from '../state.js';

/**
 * @typedef {import('../couriers/accounts.js').default} AccountsCourier
 * @typedef {import('../dataservices/profiles.js').default} ProfilesDataservice
 * @typedef {import('../state.js').UserInfo} UserInfo
 */

export default class IdService extends Service {
  /**
   * @type {ProfilesDataservice}
   */
  _profiles;
  /**
   * @type {AccountsCourier}
   */
  _accountsCourier;
  static get deps() {
    return {
      _profiles: '/ds/profiles',
      _accountsCourier: '/c/accounts',
    };
  }

  /**
   *
   * @param {string} sessionId
   * @returns {Promise<UserInfo>}
   */
  async collectUserInformationBySession(sessionId) {
    if (!sessionId) return { status: IdStatus.UNAUTHORIZED };

    const account = await this._accountsCourier.getAccountBySession(sessionId);

    if (!account) return { status: IdStatus.UNAUTHORIZED };

    const profiles = await this._profiles.read(
      { uinfo: { status: IdStatus.SYSTEM } },
      { id: account.id }
    );
    if (profiles.length === 0) return { account, status: IdStatus.NOPROFILE };

    return { account, profile: profiles[0], status: IdStatus.AUTHORIZED };
  }
}
