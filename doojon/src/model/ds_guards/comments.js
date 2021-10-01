import { DataserviceGuard } from '../ds_guard.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class CommentsGuard extends DataserviceGuard {
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

  static get _whereReadSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['id'],
      properties: { id: { type: 'string' } },
    };
  }

  static get _whatReadSchema() {
    return {
      type: 'array',
      minItems: 1,
      items: {
        type: 'string',
        enum: ['text', 'postId', 'authorId', 'id', 'created'],
      },
    };
  }

  static get _whereUpdateSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['id'],
      properties: { id: { type: 'string' } },
    };
  }

  static get _whatUpdateSchema() {
    return {
      type: 'object',
      minProperties: 1,
      additionalProperties: false,
      properties: {
        text: { type: 'string' },
        postId: { type: 'string' },
        authorId: { type: 'string' },
      },
    };
  }

  static get _whereDeleteSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['id'],
      properties: { id: { type: 'string' } },
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
