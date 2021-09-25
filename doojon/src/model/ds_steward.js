import { Database } from '@google-cloud/spanner';
import { Service } from './service.js';
import { State } from './state.js';

/**
 * General class for dataservice stewards.
 * Stewards modify incoming data and run post-actions
 */
export class DataserviceSteward extends Service {
  /**
   * @type {Database}
   */
  _db;

  static get deps() {
    return Object.assign(
      {
        _db: '/h/db',
      },
      this._customdeps
    );
  }
  static get _customdeps() {
    return {};
  }

  /**
   * Dataservices call this method of their steward to
   * modify inserting data according to domain logic.
   *
   * For example, every inserted challenge has to be
   * proposed by someone, so code in `precreateAction` method
   * has to set someone on this position.
   *
   * @param {State} state
   * @param {Array<Object>} objects
   */
  async precreateAction(state, objects) {}

  /**
   * Dataservices call this method of their steward to
   * perform any actions after creating new objects
   * using their primary keys
   *
   * @param {State} state
   * @param {Array<string>} pkeys - primary keys
   */
  async postcreateAction(state, pkeys) {}
}
