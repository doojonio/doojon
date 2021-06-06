const Service = require('./service');

class Dataservice extends Service {
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
    const fields = this.fields;
    const pkeys = [];

    for (const colname of Object.keys(fields)) {
      if (this.fields[colname]['is_primary_key']) pkeys.push(colname);
    }

    return pkeys;
  }

  async create(objects) {
    return this._db(this.constructor._tablename)
      .insert(objects)
      .returning(this._primarykeys);
  }

  async read(where) {
    return this._db.select().from(this.constructor._tablename).where(where);
  }

  async update(where, newFields) {
    return this._db(this.constructor._tablename)
      .where(where)
      .update(newFields)
      .returning(this._primarykeys);
  }

  async delete(where) {
    return this._db(this.constructor._tablename)
      .delete()
      .where(where)
      .returning(this._primarykeys);
  }
}

module.exports = Dataservice;
