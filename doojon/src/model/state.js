export const IdStatus = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOPROFILE: 'NOPROFILE',
  AUTHORIZED: 'AUTHORIZED',
};

export class State {
  /**
   * @type {Profile}
   */
  profile;
}

/**
 * @typedef {object} Profile
 * @property {string} id
 * @property {username} string
 * @property {string} status
 */
