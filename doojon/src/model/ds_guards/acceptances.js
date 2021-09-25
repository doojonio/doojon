import { DataserviceGuard } from '../ds_guard.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class AcceptancesGuard extends DataserviceGuard {
  static get _createSchema() {
    return {
      type: 'array',
      maxItems: 1,
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          challengeId: { type: 'string', maxLength: 11 },
          profileId: { type: 'string', maxLength: 36 },
          status: { type: 'string', maxLength: 16 },
        },
        required: ['challengeId', 'profileId', 'status'],
      },
    };
  }

  /**
   * - User has to be authorized
   *
   * @param {State} state
   * @param {Array<Object>} objects
   */
  precreateCheck(state, objects) {
    this.isAuthorized(state);
  }
}
