import { DataserviceGuard } from '../ds_guard.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class PostsGuard extends DataserviceGuard {
  static get _createSchema() {
    return {
      type: 'array',
      maxItems: 1,
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          text: { type: 'string', maxLength: 10000 },
          authorId: { type: 'string', maxLength: 36 },
        },
        required: ['text', 'authorId'],
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
