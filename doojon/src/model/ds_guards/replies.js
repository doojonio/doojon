import { DataserviceGuard } from '../ds_guard.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class RepliesGuard extends DataserviceGuard {
  static get _createSchema() {
    return {
      type: 'array',
      maxItems: 1,
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          commentId: { type: 'string', maxLength: 26 },
          authorId: { type: 'string', maxLength: 36 },
          text: { type: 'string', maxLength: 10000 },
        },
        required: ['commentId', 'authorId', 'text'],
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
