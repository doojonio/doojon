export const IdStatus = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  AUTHORIZED: 'AUTHORIZED',
};

export class State {
  constructor(identity) {
    /**
     * @type {Identity}
     */
    this.identity = identity;
  }
}

/**
 * @typedef {object} Identity
 * @property {string} profileId
 * @property {string} username
 * @property {string} status
 */
