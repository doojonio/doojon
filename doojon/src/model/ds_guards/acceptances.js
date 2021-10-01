import { DataserviceGuard } from '../ds_guard.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class AcceptancesGuard extends DataserviceGuard {
  static get _objectsCreateSchema() {
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
          'challengeId',
          'profileId',
          'updated',
          'id',
          'created',
          'status',
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
        challengeId: { type: 'string' },
        profileId: { type: 'string' },
        status: { type: 'string' },
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
