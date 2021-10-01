import { DataserviceGuard } from '../ds_guard.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class ProgressesBySpendedDaysGuard extends DataserviceGuard {
  static get _objectsCreateSchema() {
    return {
      type: 'array',
      maxItems: 1,
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          untillDate: { type: ['string', 'null'] },
          acceptanceId: { type: 'string', maxLength: 26 },
          spendedDays: { type: 'integer' },
        },
        required: ['acceptanceId', 'spendedDays'],
      },
    };
  }

  static get _whereReadSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['acceptanceId'],
      properties: { acceptanceId: { type: 'string' } },
    };
  }

  static get _whatReadSchema() {
    return {
      type: 'array',
      minItems: 1,
      items: {
        type: 'string',
        enum: ['untillDate', 'acceptanceId', 'spendedDays'],
      },
    };
  }

  static get _whereUpdateSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['acceptanceId'],
      properties: { acceptanceId: { type: 'string' } },
    };
  }

  static get _whatUpdateSchema() {
    return {
      type: 'object',
      minProperties: 1,
      additionalProperties: false,
      properties: {
        untillDate: { type: ['string', 'null'] },
        spendedDays: { type: 'integer' },
      },
    };
  }

  static get _whereDeleteSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      required: ['acceptanceId'],
      properties: { acceptanceId: { type: 'string' } },
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
