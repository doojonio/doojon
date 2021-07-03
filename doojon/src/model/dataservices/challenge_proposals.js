import { Dataservice } from '../dataservice.js';

export default class ChallengeProposalsDataservice extends Dataservice {
  static get _tablename() {
    return 'challenge_proposals';
  }
}
