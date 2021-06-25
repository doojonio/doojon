import { Service } from '../service.js';

export default class StateService extends Service {
  _currentUser = null;

  static get deps() {
    return {
      _log: '/h/log'
    };
  }

  getCurrentUser() {
    return this._currentUser;
  }

  setCurrentUser(user) {
    for (const required of ['email', 'id']) {
      if (!user[required])
        throw new Error(`Missing ${required}`)
    }

    this._log.trace(`Setting current user (id: ${user.id}, email: ${user.email})`);
    this._currentUser = {
      id: user.id,
      email: user.email,
    };
  }
}