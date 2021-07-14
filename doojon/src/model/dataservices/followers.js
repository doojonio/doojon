import { Dataservice } from '../dataservice.js';

export default class FollowersDataservice extends Dataservice {
  static get _tablename() {
    return 'followers';
  }
}
