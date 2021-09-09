import { DataserviceGuard } from "../ds_guard";
import { State } from "../state";

export default class EventsGuard extends DataserviceGuard {

  /**
   * - User has to be authorized
   *
   * @param {State} state
   * @param {Array<Object>} challenges
   */
  precreateCheck(state) {
    this.isAuthorized(state);
  }

  /**
   *
   * @param {State} state
   * @param {Object} where
   */
  predeleteCheck(state, where) {
    this.isAuthorized(state);

    const type = where.type;
    if (!type) throw new ForbiddenError();

    const handler = this[`_handleDeleteCheck_${type}`];

    if (!(handler instanceof Function)) throw new ForbiddenError();

    handler.call(this, state, where);
  }

  _handleDeleteCheck_post_liked(state, where) {
    this.validateFields(where, ['object', 'type'], { strict: true });
  }

  _preCreate(state, events) {
    for (const event of events) {
      event.emitter = state.uinfo.account.id;
    }
  }

  _preDelete(state, where) {
    where.emitter = state.uinfo.account.id;
  }
}