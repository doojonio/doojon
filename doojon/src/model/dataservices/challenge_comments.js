import { Dataservice } from '../dataservice.js';

export default class ChallengeCommentsDataservice extends Dataservice {
  static get _tablename() {
    return 'challenge_comments';
  }
}
