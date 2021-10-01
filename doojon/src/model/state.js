export const IdStatus = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  AUTHORIZED: 'AUTHORIZED',
};

export class State {
  /**
   * @type {Identity}
   */
  identity;

  constructor(identity) {
    this.identity = identity;
  }
}

/**
 * @typedef {object} Identity
 * @property {string} profileId
 * @property {username} string
 * @property {string} status
 */
