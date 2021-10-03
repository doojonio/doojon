import { DataserviceGuard } from '../ds_guard.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class CommentsGuard extends DataserviceGuard {
  static get _tableName() {
    return 'Comments';
  }

  static get _objectsCreateSchema() {
    return {
      type: 'array',
      maxItems: 1,
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          text: { type: 'string', maxLength: 10000 },
          postId: { type: 'string', maxLength: 11 },
          authorId: { type: 'string', maxLength: 36 },
        },
        required: ['text', 'postId', 'authorId'],
      },
    };
  }

  static get _keysSchema() {
    return {
      type: 'array',
      minItems: 1,
      maxItems: 1,
      description: 'id',
      items: { type: 'string' },
    };
  }

  static get _columnsReadSchema() {
    return {
      type: 'array',
      minItems: 1,
      maxItems: 5,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['text', 'postId', 'authorId', 'id', 'created'],
      },
    };
  }

  static get _rowsUpdateSchema() {
    return {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        minProperties: 2,
        additionalProperties: false,
        properties: {
          text: { type: 'string', maxLength: 10000 },
          postId: { type: 'string', maxLength: 11 },
          authorId: { type: 'string', maxLength: 36 },
          id: { type: 'string', maxLength: 26 },
        },
        required: ['id'],
      },
    };
  }

  /**
   * - User has to be authorized
   *
   * @param {State} state
   * @param {Array<Object>} objects
   */
  _preCreateAdditionalChecks(state, objects) {
    this.isAuthorized(state);
  }
}
