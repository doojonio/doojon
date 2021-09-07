export const ID_STATUS_UNAUTHORIZED = 'UNAUTHORIZED';
export const ID_STATUS_NOPROFILE = 'NOPROFILE';
export const ID_STATUS_AUTHORIZED = 'AUTHORIZED';
export const ID_STATUS_SYSTEM = 'SYSTEM';

export class State {
  /**
   * @type {UserInfo}
   */
  uinfo;
}

export class UserInfo {
  /**
   * @type {string}
   */
  status;
  /**
   * @type {AccountInfo}
   */
  account;
}

export class AccountInfo {
  /**
   * @type {string}
   */
  id;
}
