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

  async checkBeforeCreate(objects) {
    return true;
  }

  async _preCreateModify(objects) {}

  async create(objects) {
    objects = Array.isArray(objects) ? objects : [objects];

    if (!await this.checkBeforeCreate(objects))
      throw new Error(`Create check didn't pass for ${this.constructor._tablename}`);
    this._log.trace(`Inserting objects in ${this.constructor._tablename}`);
    this._preCreateModify(objects);
    return this._db(this.constructor._tablename)
      .insert(objects)
      .returning(this._primarykeys);
  }

  async checkBeforeRead(where) {
    return true;
  }

  async read(where) {
    if (!await this.checkBeforeRead(where))
      throw new Error(`Read check didn't pass for ${this.constructor._tablename}`);
    this._log.trace(`Reading objects from ${this.constructor._tablename}`);
    return this._db.select().from(this.constructor._tablename).where(where);
  }

  async checkBeforeUpdate(where, newFields) {
    return true;
  }

  async update(where, newFields) {
    if (!await this.checkBeforeUpdate(where, newFields))
      throw new Error(`Update check didn't pass for ${this.constructor._tablename}`);
    this._log.trace(`Updating objects in ${this.constructor._tablename}`);
    return this._db(this.constructor._tablename)
      .where(where)
      .update(newFields)
      .returning(this._primarykeys);
  }

  async checkBeforeDelete(where) {
    return true;
  }

  async delete(where) {
    if (!await this.checkBeforeDelete(where))
      throw new Error(`Delete check didn't pass for ${this.constructor._tablename}`);
    this._log.trace(`Deleting objects from ${this.constructor._tablename}`);
    return this._db(this.constructor._tablename)
      .delete()
      .where(where)
      .returning(this._primarykeys);
  }
}
