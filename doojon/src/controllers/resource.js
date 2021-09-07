import { ForbiddenError, NotAuthorizedError } from '../model/errors.js';

import Context from '@mojojs/core/lib/context';
import { Dataservice } from '../model/dataservice.js';

export default class ResourceController {
  /**
   *
   * @param {Context} ctx
   */
  async create(ctx) {
    /**
     * @type Dataservice
     */
    const ds = ctx.app.model.getDataservice(ctx.stash.dsname);
    const objects = await ctx.req.json();

    const state = await ctx.getState(ctx);

    try {
      await ds.checkBeforeCreate(state, objects)
    }
    catch (e) {
      if (e instanceof NotAuthorizedError)
        return ctx.res.status(401).send(`User is not authorized`);
      if (e instanceof ForbiddenError)
        return ctx.res.status(403).send(`Foribdden`);

      ctx.app.log.debug(`Error during check for creating: ${e}`)
      return ctx.res.status(400).send(`check before creating has not passed: ${e}`);
    }

    const ids = await ds.create(state, objects);
    return ctx.render({ json: ids });
  }

  /**
   *
   * @param {Context} ctx
   */
  async read(ctx) {
    /**
     * @type Dataservice
     */
    const ds = ctx.app.model.getDataservice(ctx.stash.dsname);
    const fields = ds.fields;

    const searchquery = this._getFieldsFromQuery(ctx, fields);
    const state = await ctx.getState(ctx);

    try {
      await ds.checkBeforeRead(state, searchquery)
    }
    catch (e) {
      if (e instanceof NotAuthorizedError)
        return ctx.res.status(401).send(`User is not authorized`);
      if (e instanceof ForbiddenError)
        return ctx.res.status(403).send(`Foribdden`);

      ctx.app.log.debug(`Error during check for reading: ${e}`)
      return ctx.res.status(400).send(`check before read has not passed ${e}`);
    }

    const objects = await ds.read(state, searchquery);
    return ctx.render({ json: objects });
  }

  /**
   *
   * @param {Context} ctx
   */
  async update(ctx) {
    /**
     * @type Dataservice
     */
    const ds = ctx.app.model.getDataservice(ctx.stash.dsname);
    const fields = ds.fields;

    const filter = this._getFieldsFromQuery(ctx, fields);
    const newFields = await ctx.req.json();

    const state = await ctx.getState(ctx);

    try {
      await ds.checkBeforeUpdate(state, filter, newFields)
    }
    catch (e) {
      if (e instanceof NotAuthorizedError)
        return ctx.res.status(401).send(`User is not authorized`);
      if (e instanceof ForbiddenError)
        return ctx.res.status(403).send(`Foribdden`);

      ctx.app.log.debug(`Error during check for updating: ${e}`)
      return ctx.res.status(400).send(`check before update has not passed ${e}`);
    }

    const ids = await ds.update(state, filter, newFields);

    return ctx.render({ json: ids });
  }

  /**
   *
   * @param {Context} ctx
   */
  async delete(ctx) {
    /**
     * @type Dataservice
     */
    const ds = ctx.app.model.getDataservice(ctx.stash.dsname);
    const fields = ds.fields;

    const filter = this._getFieldsFromQuery(ctx, fields);

    const state = await ctx.getState(ctx);

    try {
      await ds.checkBeforeDelete(state, filter)
    }
    catch (e) {
      if (e instanceof NotAuthorizedError)
        return ctx.res.status(401).send(`User is not authorized`);
      if (e instanceof ForbiddenError)
        return ctx.res.status(403).send(`Foribdden`);

      ctx.app.log.debug(`Error during check for deleting: ${e}`)
      return ctx.res.status(400).send(`check before delete has not passed: ${e}`);
    }

    const ids = await ds.delete(state, filter);

    if (ids.length === 0) {
      return ctx.res.status(404).send('no items to delete');
    }

    return ctx.render({ json: ids });
  }

  /**
   *
   * @param {Context} ctx
   * @param {Object} fields
   * @returns {Object} fieldsFromQuery
   */
  _getFieldsFromQuery(ctx, fields) {
    const fieldsFromQuery = {};

    for (const fieldname of Object.keys(fields)) {
      const field = ctx.req.query.get(fieldname);
      if (field !== null) {
        fieldsFromQuery[fieldname] = field;
      }
    }

    return fieldsFromQuery;
  }
}
