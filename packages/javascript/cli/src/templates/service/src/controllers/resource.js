import {
  ForbiddenError,
  NotAuthorizedError,
  ValidationError,
} from '../model/errors.js';

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
        return ctx.render({ status: 400, json: error });
      }

      if (error instanceof NotAuthorizedError) {
        return ctx.render({ status: 401, json: error });
      }

      if (error instanceof ForbiddenError) {
        return ctx.render({ status: 403, json: error });
      }

      // Unrecognized exception
      throw error;
    }

    const response = {
      kind: 'KeysObject',
      items: keys,
    };

    return ctx.render({ json: response });
  }
}
