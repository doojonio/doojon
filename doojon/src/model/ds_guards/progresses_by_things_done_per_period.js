import { DataserviceGuard } from '../ds_guard.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class ProgressesByThingsDonePerPeriodGuard extends DataserviceGuard {
  static get _createSchema() {
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
