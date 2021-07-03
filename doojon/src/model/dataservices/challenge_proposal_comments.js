import { Dataservice } from '../dataservice.js';

export default class ChallengeProposalCommentsDataservice extends Dataservice {
  static get _tablename() {
    return 'challenge_proposal_comments';
  }
}
