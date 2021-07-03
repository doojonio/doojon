import { Dataservice } from '../dataservice.js';

export default class ChallengeProposalLikesDataservice extends Dataservice {
  static get _tablename() {
    return 'challenge_proposal_likes';
  }
}
