import { DataserviceGuard } from '../ds_guard.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class ChallengesGuard extends DataserviceGuard {
  static get _createSchema() {
    return {
      type: 'array',
      maxItems: 1,
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          criterionType: { type: 'string', maxLength: 16 },
          title: { type: 'string', maxLength: 100 },
          authorId: { type: ['string', 'null'], maxLength: 36 },
          description: { type: 'string', maxLength: 10000 },
          isPublic: { type: 'boolean' },
        },
        required: ['criterionType', 'title', 'description', 'isPublic'],
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
