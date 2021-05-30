export default class ResourceController {
  create(ctx) {
    ctx.render({ json: 'OK' });
  }

  read(ctx) {
    console.log(ctx.stash);
    ctx.render({ json: 'OK' });
  }

  update(ctx) {
    ctx.render({ json: 'OK' });
  }

  delete(ctx) {
    ctx.render({ json: 'OK' });
  }
}
