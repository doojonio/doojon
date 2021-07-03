import { Dataservice } from '../dataservice.js';

export default class ChallengeProposalCommentLikesDataservice extends Dataservice {
  static get _tablename() {
    return 'challenge_proposal_comment_likes';
  }
}
