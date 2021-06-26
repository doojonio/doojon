import { Service } from './service.js';

export class Dataservice extends Service {
  static get deps() {
    return Object.assign(
      {
        _log: '/h/log',
        _db: '/h/db',
        _dbschema: '/h/db/schema',
      },
      this._customdeps
    );
  }
  static get _customdeps() {
    return {};
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

  async checkBeforeCreate(state, objects) {}

  async _preCreateModify(state, objects) {}

  async create(state, objects) {
    objects = Array.isArray(objects) ? objects : [objects];

    await this.checkBeforeCreate(state, objects);

    this._log.trace(`Inserting objects in ${this.constructor._tablename}`);
    this._preCreateModify(state, objects);

    return this._db(this.constructor._tablename)
      .insert(objects)
      .returning(this._primarykeys);
  }

  async checkBeforeRead(state, where) {}

  async read(state, where) {
    await this.checkBeforeRead(state, where);

    this._log.trace(`Reading objects from ${this.constructor._tablename}`);
    return this._db.select().from(this.constructor._tablename).where(where);
  }

  async checkBeforeUpdate(state, where, newFields) {}

  async update(state, where, newFields) {
    await this.checkBeforeUpdate(state, where, newFields);

    this._log.trace(`Updating objects in ${this.constructor._tablename}`);
    return this._db(this.constructor._tablename)
      .where(where)
      .update(newFields)
      .returning(this._primarykeys);
  }

  async checkBeforeDelete(state, where) {}

  async delete(state, where) {
    await this.checkBeforeDelete(state, where);

    this._log.trace(`Deleting objects from ${this.constructor._tablename}`);
    return this._db(this.constructor._tablename)
      .delete()
      .where(where)
      .returning(this._primarykeys);
  }
}
