import { IdStatus } from '../state.js';

export default class IdService {
  static get deps() {
    return {
      _profiles: '/ds/profiles',
      _sessions: '/s/sessions',
    };
  }

  async updateIdentityForSession(state, sessionId) {
    if (!sessionId) {
      this._setUnauthorized(state);
      return;
    }

    const profileId = await this._sessions.readSession(sessionId);
    if (profileId === undefined) {
      this._setUnauthorized(state);
      return;
    }
    const username = await this._profiles.read([[profileId]], ['username']);

    state.identity.status = IdStatus.AUTHORIZED;
    state.identity.username = username;
    state.identity.profileId = profileId;
  }

  _setUnauthorized(state) {
    state.identity.status = IdStatus.UNAUTHORIZED;
    state.identity.profileId = undefined;
    state.identity.username = undefined;
  }
}
