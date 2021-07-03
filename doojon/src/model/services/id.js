import { Service } from '../service.js';

export const ID_STATUS_UNAUTHORIZED = 'UNAUTHORIZED';
export const ID_STATUS_NOPROFILE = 'NOPROFILE';
export const ID_STATUS_AUTHORIZED = 'AUTHORIZED';

export default class IdService extends Service {
  static get deps() {
    return {
      _profiles: '/ds/profiles',
      _accountsCourier: '/c/accounts',
    };
  }

  async collectUserInformationBySession(sessionId) {
    if (!sessionId) return { status: ID_STATUS_UNAUTHORIZED };

    const account = await this._accountsCourier.getAccountBySession(sessionId);

    if (!account) return { status: ID_STATUS_UNAUTHORIZED };

    const profiles = await this._profiles.read({}, { id: account.id });
    if (profiles.length === 0) return { account, status: ID_STATUS_NOPROFILE };

    return { account, profile: profiles[0], status: ID_STATUS_AUTHORIZED };
  }
}
