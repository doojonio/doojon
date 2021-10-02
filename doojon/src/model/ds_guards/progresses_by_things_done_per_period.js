import { DataserviceGuard } from '../ds_guard.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class ProgressesByThingsDonePerPeriodGuard extends DataserviceGuard {
  static get _tableName() {
    return 'ProgressesByThingsDonePerPeriod';
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
          period: { type: 'integer' },
          times: { type: 'integer' },
          thing: { type: 'string', maxLength: 150 },
          acceptanceId: { type: 'string', maxLength: 26 },
          periodsNum: { type: ['integer', 'null'] },
        },
        required: ['period', 'times', 'thing', 'acceptanceId'],
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
      maxItems: 5,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['period', 'times', 'thing', 'acceptanceId', 'periodsNum'],
      },
    };
  }

  static get _rowsUpdateSchema() {
    return {
      type: 'object',
      minProperties: 2,
      additionalProperties: false,
      properties: {
        period: { type: 'integer' },
        times: { type: 'integer' },
        thing: { type: 'string', maxLength: 150 },
        acceptanceId: { type: 'string', maxLength: 26 },
        periodsNum: { type: ['integer', 'null'] },
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
