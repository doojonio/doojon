import { ValidationError } from '../errors.js';

export default class ChallengeCreatorService {
  static get deps() {
    return {
      _stateChecker: '/s/state_checker',
      _validator: '/s/validator',
      _challenges: '/ds/challenges',
    };
  }

  async createChallenge(state, challenge) {
    this._stateChecker.ensureAuthroized(state);
  }
}
