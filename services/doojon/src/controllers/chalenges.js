import { ParsingError } from '../errors.js';
import {
  FailedAuthError,
  NotAuthorizedError,
  NotFoundError,
} from '../model/errors.js';

export default class ChallengesController {
  createChallenge(ctx) {
    let challenge;
    try {
      challenge = ctx.req.json();
    } catch (err) {
      new ParsingError(err);
    }

    const state = ctx.getState();
    ctx.getService('challenge_creator').createChallenge(state, challenge);
  }
}
