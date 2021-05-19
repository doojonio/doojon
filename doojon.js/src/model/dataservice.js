

export default class Dataservice {
  deps = {
    _db: '/h/db'
  };

  get table() {
    throw new Error('table missing')
  }
  get fields() {
    throw new Error('fields missing')
  };

  constructor({db}) {
    if (!db) throw new Error('missing database handler')
    this._db = db;
  }
}