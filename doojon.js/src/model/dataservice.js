import Service from './service.js';

export default class Dataservice extends Service {
  static get deps() {
    return {
      _db: '/h/db',
      _dbschema: '/h/db/schema',
    };
  }
}
