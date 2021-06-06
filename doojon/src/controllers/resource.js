class ResourceController {
  async create(ctx) {
    const ds = ctx.app.model.getDataservice(ctx.stash.dsname);
    const objects = await ctx.req.json();

    if (!await ds.checkBeforeCreate(objects))
      return ctx.res.status(400).send('check before create has not passed');

    const ids = await ds.create(objects);
    return ctx.render({ json: ids });
  }

  async read(ctx) {
    const ds = ctx.app.model.getDataservice(ctx.stash.dsname);
    const fields = ds.fields;

    const searchquery = this._getFieldsFromQuery(ctx, fields);

    if (!await ds.checkBeforeRead(searchquery))
      return ctx.res.status(400).send('check before read has not passed');

    const objects = await ds.read(searchquery);
    return ctx.render({ json: objects });
  }

  async update(ctx) {
    const ds = ctx.app.model.getDataservice(ctx.stash.dsname);
    const fields = ds.fields;

    const filter = this._getFieldsFromQuery(ctx, fields);
    const newFields = await ctx.req.json();

    if (!await ds.checkBeforeUpdate(filter, newFields))
      return ctx.res.status(400).send('check before update has not passed');

    const ids = await ds.update(filter, newFields);

    return ctx.render({ json: ids });
  }

  async delete(ctx) {
    const ds = ctx.app.model.getDataservice(ctx.stash.dsname);
    const fields = ds.fields;

    const filter = this._getFieldsFromQuery(ctx, fields);

    if (!await ds.checkBeforeDelete(filter))
      return ctx.res.status(400).send('check before delete has not passed');

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
