import { Service } from '@doojons/breadboard';
import { IdStatus } from '../state.js';
import { ForbiddenError, NotAuthorizedError } from '../errors.js';

export default class StateCheckerService extends Service {
  ensureNotAuthorized(state) {
    if (state.identity.status !== IdStatus.UNAUTHORIZED) {
      throw new ForbiddenError('User has to be unauthorized');
    }
  }

  ensureAuthorized(state) {
    if (state.identity.status !== IdStatus.AUTHORIZED) {
      throw new NotAuthorizedError();
    }
  }
}
