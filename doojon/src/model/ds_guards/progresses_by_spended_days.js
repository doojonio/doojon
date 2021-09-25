import { DataserviceGuard } from '../ds_guard.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class ProgressesBySpendedDaysGuard extends DataserviceGuard {
  static get _createSchema() {
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
