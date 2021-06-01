import Service from './service.js';

export default class Dataservice extends Service {
  static get deps() {
    return {
      _db: '/h/db',
      _dbschema: '/h/db/schema',
    };
  }

  static get _tablename() {
    throw new Error('_tablename is undefined');
  }

  get fields() {
    return this._dbschema[this.constructor._tablename];
  }

  get _primarykeys() {
    return this.fields.filter(f => f['is_primary_key']);
  }

  async create(objects) {
    return this._db(this.constructor._tablename)
      .create(objects)
      .returning(this._primarykeys);
  }

  async read(where) {
    return this._db.select().from(this.constructor._tablename).where(where);
  }
}
