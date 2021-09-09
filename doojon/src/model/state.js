export const ID_STATUS_UNAUTHORIZED = 'UNAUTHORIZED';
export const ID_STATUS_NOPROFILE = 'NOPROFILE';
export const ID_STATUS_AUTHORIZED = 'AUTHORIZED';
export const ID_STATUS_SYSTEM = 'SYSTEM';

export const IdStatus = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOPROFILE: 'NOPROFILE',
  AUTHORIZED: 'AUTHORIZED',
  SYSTEM: 'SYSTEM',
};

export class State {
  /**
   * @type {UserInfo}
   */
  uinfo;
}

/**
 * @typedef {object} UserInfo
 * @property {string} status
 * @property {AccountInfo} account
 */

/**
 * @typedef {object} AccountInfo
 * @property {string} id
 */
