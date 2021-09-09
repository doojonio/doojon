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
