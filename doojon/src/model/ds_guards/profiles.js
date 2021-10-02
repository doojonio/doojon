import { DataserviceGuard } from '../ds_guard.js';
import { ForbiddenError } from '../errors.js';
import { IdStatus } from '../state.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class ProfilesGuard extends DataserviceGuard {
  static get _tableName() {
    return 'Profiles';
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
          username: { type: 'string', maxLength: 16 },
          bio: { type: ['string', 'null'], maxLength: 300 },
          email: { type: 'string', maxLength: 320 },
          password: { type: 'string', minLength: 8, maxLength: 32 },
        },
        required: ['username', 'email', 'password'],
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
        enum: ['username', 'id', 'bio', 'email', 'created', 'password'],
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
        username: { type: 'string' },
        bio: { type: ['string', 'null'] },
        email: { type: 'string' },
        password: { type: 'string' },
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
    if (state.identity.status !== IdStatus.UNAUTHORIZED) {
      throw new ForbiddenError(
        'User has to be unauthorized to create profiles'
      );
    }
  }
}
