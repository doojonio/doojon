import { DataserviceGuard } from '../ds_guard.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class ProgressesByThingsDonePerPeriodGuard extends DataserviceGuard {
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
        enum: ['period', 'times', 'thing', 'acceptanceId', 'periodsNum'],
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
        period: { type: 'integer' },
        times: { type: 'integer' },
        thing: { type: 'string' },
        periodsNum: { type: ['integer', 'null'] },
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
