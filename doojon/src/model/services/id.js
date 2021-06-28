import { Service } from '../service.js';

export const ID_STATUS_UNAUTHORIZED = 'UNAUTHORIZED';
export const ID_STATUS_NOPROFILE = 'NOPROFILE';
export const ID_STATUS_AUTHORIZED = 'AUTHORIZED';

export default class IdService extends Service {
  static get deps() {
    return {
      _profiles: '/ds/profiles',
    };
  }

  async collectUserInformation(state) {
    let account = state.getAccount();
    if (!account) return { status: ID_STATUS_UNAUTHORIZED };

    const profiles = await this._profiles.read(state, { id: account.id });
    if (profiles.length === 0) return { account, status: ID_STATUS_NOPROFILE };

    return { account, profile: profiles[0], status: ID_STATUS_AUTHORIZED };
  }
}
