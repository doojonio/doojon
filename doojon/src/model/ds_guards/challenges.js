import { DataserviceGuard } from '../ds_guard.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class ChallengesGuard extends DataserviceGuard {
  static get _objectsCreateSchema() {
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
        enum: [
          'criterionType',
          'id',
          'title',
          'authorId',
          'description',
          'isPublic',
          'created',
        ],
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
        criterionType: { type: 'string' },
        title: { type: 'string' },
        authorId: { type: ['string', 'null'] },
        description: { type: 'string' },
        isPublic: { type: 'boolean' },
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
