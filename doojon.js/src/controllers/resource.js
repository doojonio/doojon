export default class ResourceController {
  async create(ctx) {
    ctx.render({ json: 'OK' });
  }

  async read(ctx) {
    const ds = ctx.app.model.getDataservice(ctx.stash.dsname);
    const fields = ds.fields;

    const params = await ctx.params();
    const searchquery = {};
    for (const field of Object.keys(fields)) {
      const value = params.get(field);

      if (value !== null)
        searchquery[field] = value;
    }

    if (Object.keys(searchquery).length === 0) {
      return ctx.res.status(400).send('need fields to search');
    }

    const objects = await ds.read(searchquery);

    console.log(objects);

    return ctx.render({ json: objects });
  }

  async update(ctx) {
    ctx.render({ json: 'OK' });
  }

  async delete(ctx) {
    ctx.render({ json: 'OK' });
  }
}
