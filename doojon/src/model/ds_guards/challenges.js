import { DataserviceGuard } from "../ds_guard";
import { State } from "../state";

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

  /**
   * Every challenge has to be proposed by someone.
   * User who makes request becomes proposer
   *
   * @param {State} state
   * @param {Array<Object>} challenges
   */
  precreateAction(state, challenges) {
    for (const c of challenges) {
      c.proposedBy = state.uinfo.account.id;
    }
  }
}