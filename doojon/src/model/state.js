export class State {
  _user = null;

  constructor(log) {
    this._log = log
  }

  getUser() {
    return this._user;
  }

  setUser(user) {
    this._log.trace(`Setting current user (id: ${user.id}, email: ${user.email})`);
    this._user = user;
  }
}
