class ResourceController {
  async create(ctx) {
    const ds = ctx.app.model.getDataservice(ctx.stash.dsname);
    const ids = await ds.create(await ctx.req.json());
    return ctx.render({ json: ids });
  }

  async read(ctx) {
    const ds = ctx.app.model.getDataservice(ctx.stash.dsname);
    const fields = ds.fields;

    const searchquery = this._getFieldsFromQuery(ctx, fields);

    const objects = await ds.read(searchquery);
    return ctx.render({ json: objects });
  }

  async update(ctx) {
    const ds = ctx.app.model.getDataservice(ctx.stash.dsname);
    const fields = ds.fields;

    const filter = this._getFieldsFromQuery(ctx, fields);
    const newFields = await ctx.req.json();

    const ids = await ds.update(filter, newFields);

    return ctx.render({ json: ids });
  }

  async delete(ctx) {
    const ds = ctx.app.model.getDataservice(ctx.stash.dsname);
    const fields = ds.fields;

    const filter = this._getFieldsFromQuery(ctx, fields);
    const ids = await ds.delete(filter);

    if (ids.length === 0) {
      return ctx.res.status(404).send('no items to delete');
    }

    return ctx.render({ json: ids });
  }

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

module.exports = ResourceController;
