import {
  ForbiddenError,
  NotAuthorizedError,
  ValidationError,
} from '../model/errors.js';

import { Dataservice } from '../model/dataservice.js';

/**
 * @typedef {import('@mojojs/core').MojoContext} Context
 */

export default class DataserviceController {
  /**
   *
   * @param {Context} ctx
   */
  async create(ctx) {
    let objects;
    try {
      objects = await ctx.req.json();
    } catch (error) {
      return ctx.render({
        status: 400,
        json: new ValidationError(`${error}`),
      });
    }

    if (!Array.isArray(objects)) {
      return ctx.render({
        status: 400,
        json: new ValidationError('JSON body is not an array'),
      });
    }

    const state = await ctx.getState();
    const dataserviceName = ctx.stash.dataserviceName;
    const dataservice = ctx.app.model.getDataservice(dataserviceName);

    let keys;
    try {
      keys = await dataservice.create(state, objects);
    } catch (error) {
      if (error instanceof ValidationError) {
        return ctx.render({status: 400, json: error});
      }

      if (error instanceof NotAuthorizedError) {
        return ctx.render({status: 401, json: error})
      }

      if (error instanceof ForbiddenError) {
        return ctx.render({status: 403, json: error});
      }

      // Unrecognized exception
      throw error;
    }

    const response = {
      kind: 'ObjectKeys',
      items: keys,
    };

    return ctx.render({ json: response });
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
      await ds.checkBeforeRead(state, searchquery);
    } catch (e) {
      if (e instanceof NotAuthorizedError)
        return ctx.res.status(401).send(`User is not authorized`);
      if (e instanceof ForbiddenError)
        return ctx.res.status(403).send(`Foribdden`);

      ctx.app.log.debug(`Error during check for reading: ${e}`);
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
      await ds.checkBeforeUpdate(state, filter, newFields);
    } catch (e) {
      if (e instanceof NotAuthorizedError)
        return ctx.res.status(401).send(`User is not authorized`);
      if (e instanceof ForbiddenError)
        return ctx.res.status(403).send(`Foribdden`);

      ctx.app.log.debug(`Error during check for updating: ${e}`);
      return ctx.res
        .status(400)
        .send(`check before update has not passed ${e}`);
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
      await ds.checkBeforeDelete(state, filter);
    } catch (e) {
      if (e instanceof NotAuthorizedError)
        return ctx.res.status(401).send(`User is not authorized`);
      if (e instanceof ForbiddenError)
        return ctx.res.status(403).send(`Foribdden`);

      ctx.app.log.debug(`Error during check for deleting: ${e}`);
      return ctx.res
        .status(400)
        .send(`check before delete has not passed: ${e}`);
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
