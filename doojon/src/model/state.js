export class State {
  _account = null;

  constructor(log) {
    this._log = log
  }

  getAccount() {
    return this._account;
  }

  setAccount(account) {
    this._log.trace(`Setting account (id: ${account.id}, email: ${account.email})`);
    this._account = account;
  }
}
