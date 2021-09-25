import { DataserviceGuard } from '../ds_guard.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class ChallengesGuard extends DataserviceGuard {
  /**
   * - User has to be authorized
   *
   * @param {State} state
   * @param {Array<Object>} challenges
   */
  precreateCheck(state, challenges) {
    this.isAuthorized(state);
  }
}
