export class State {
  _userinfo = undefined;

  constructor(log) {
    this._log = log
  }

  getUserInfo() {
    return this._userinfo;
  }

  setUserInfo(uinfo) {
    this._log.trace(`Setting user info (status: ${uinfo.status})`);
    this._userinfo = uinfo;
  }
}
