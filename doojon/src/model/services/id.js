import AccountsCourier from '../couriers/accounts.js';
import ProfilesDataservice from '../dataservices/profiles.js';
import { Service } from '../service.js';
import {
  ID_STATUS_NOPROFILE,
  ID_STATUS_UNAUTHORIZED,
  ID_STATUS_AUTHORIZED,
  ID_STATUS_SYSTEM,
  UserInfo,
} from '../state.js';

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
    if (!sessionId) return { status: ID_STATUS_UNAUTHORIZED };

    const account = await this._accountsCourier.getAccountBySession(sessionId);

    if (!account) return { status: ID_STATUS_UNAUTHORIZED };

    const profiles = await this._profiles.read(
      { uinfo: { status: ID_STATUS_SYSTEM } },
      { id: account.id }
    );
    if (profiles.length === 0) return { account, status: ID_STATUS_NOPROFILE };

    return { account, profile: profiles[0], status: ID_STATUS_AUTHORIZED };
  }
}
