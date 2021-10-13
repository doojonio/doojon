import { Service } from '../service.js';
import { IdStatus } from '../state.js';
import { ForbiddenError, NotAuthorizedError } from '../errors.js';

export default class StateCheckerService extends Service {
  async ensureNotAuthorized(state) {
    if (state.identity.status !== IdStatus.UNAUTHORIZED) {
      throw new ForbiddenError('User has to be unauthorized');
    }
  }

  async ensureAuthorized(state) {
    if (state.identity.status !== IdStatus.AUTHORIZED) {
      throw new NotAuthorizedError();
    }
  }
}
