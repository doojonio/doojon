import Service from './service.js';

export default class Dataservice extends Service {
  static get deps() {
    return {
      _db: '/h/db'
    };
  }

  get table() {
    throw new Error('table missing');
  }
  get fields() {
    throw new Error('fields missing');
  }

}