import { Service } from './service.js';
import { ID_STATUS_SYSTEM } from './state.js';
import { ForbiddenError } from './errors.js';

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
    return this._dbschema.tables[this.constructor._tablename];
  }

  get _primarykeys() {
    const fields = this.fields;
    const pkeys = [];

    for (const colname of Object.keys(fields)) {
      if (this.fields[colname]['is_primary_key']) pkeys.push(colname);
    }

    return pkeys;
  }

  async checkBeforeCreate(state, objects) {
    throw new Error('create on this dataservice is fordbidden')
  }

  async _preCreate(state, objects) {}

  async create(state, objects) {
    objects = Array.isArray(objects) ? objects : [objects];

    await this.checkBeforeCreate(state, objects);

    this._log.trace(`Inserting objects in ${this.constructor._tablename}`);
    await this._preCreate(state, objects);

    const ids = await this._db(this.constructor._tablename)
      .insert(objects)
      .returning(this._primarykeys);

    await this._postCreate(state, ids);

    return ids;
  }

  async _postCreate(state, ids) {}

  async checkBeforeRead(state, where) {
    throw new ForbiddenError('read on dataservice is forbidden')
  }

  async read(state, where) {

    if (state.uinfo.status !== ID_STATUS_SYSTEM)
      await this.checkBeforeRead(state, where);

    this._log.trace(`Reading objects from ${this.constructor._tablename}`);
    return await this._db.select().from(this.constructor._tablename).where(where);
  }

  async checkBeforeUpdate(state, where, newFields) {
    throw new ForbiddenError('update on dataservice is forbidden')
  }

  async update(state, where, newFields) {
    await this.checkBeforeUpdate(state, where, newFields);

    this._log.trace(`Updating objects in ${this.constructor._tablename}`);
    return await this._db(this.constructor._tablename)
      .where(where)
      .update(newFields)
      .returning(this._primarykeys);
  }

  async checkBeforeDelete(state, where) {
    throw new ForbiddenError('delete on dataservice is forbidden')
  }

  _preDelete(state, where) {}
  async delete(state, where) {
    await this.checkBeforeDelete(state, where);
    await this._preDelete(state, where);

    this._log.trace(`Deleting objects from ${this.constructor._tablename}`);
    return await this._db(this.constructor._tablename)
      .delete()
      .where(where)
      .returning(this._primarykeys);
  }

  validateFields(fields, againstFields = undefined, options = { strict: false }) {
    const allowedFields = againstFields ?? Object.keys(this._fields);

    if (Object.keys(fields).length > Object.keys(allowedFields).length )
      throw new Error('extra fields found');

    const foundFields = [];
    for (const key in fields) {
      if (!allowedFields.includes(key))
        throw new Error(`${key} is not allowed`)
      foundFields.push(key)
    }

    if (options.strict) {
      for (const needed of allowedFields) {
        if (!foundFields.includes(needed))
          throw new Error(`${needed} field not found`);
      }
    }

    return;
  }
}
