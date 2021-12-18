import { FailedAuthError, ValidationError } from '../errors.js';

const CRITERION_BY_SPENDED_DAYS = 'bySpendedDays';
const CRITERION_BY_THINGS_DONE_PER_PERIOD = 'byThingsDonePerPeriod';

export default class ChallengeCreatorService {
  static get deps() {
    return {
      _stateChecker: '/s/state_checker',
      _validator: '/s/validator',
      _challenges: '/ds/challenges',
    };
  }

  createChallenge(state, challenge) {}
}
