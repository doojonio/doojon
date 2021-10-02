import { DataserviceGuard } from '../ds_guard.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class ProgressesBySpendedDaysGuard extends DataserviceGuard {
  static get _tableName() {
    return 'ProgressesBySpendedDays';
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
          untillDate: { type: ['string', 'null'] },
          acceptanceId: { type: 'string', maxLength: 26 },
          spendedDays: { type: 'integer' },
        },
        required: ['acceptanceId', 'spendedDays'],
      },
    };
  }

  static get _keysSchema() {
    return {
      type: 'array',
      minItems: 1,
      maxItems: 1,
      description: 'acceptanceId',
      items: { type: 'string' },
    };
  }

  static get _columnsReadSchema() {
    return {
      type: 'array',
      minItems: 1,
      maxItems: 3,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['untillDate', 'acceptanceId', 'spendedDays'],
      },
    };
  }

  static get _rowsUpdateSchema() {
    return {
      type: 'object',
      minProperties: 2,
      additionalProperties: false,
      properties: {
        untillDate: { type: ['string', 'null'] },
        acceptanceId: { type: 'string', maxLength: 26 },
        spendedDays: { type: 'integer' },
      },
      required: ['acceptanceId'],
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
