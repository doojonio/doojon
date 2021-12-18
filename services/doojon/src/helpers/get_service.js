export default function getService(ctx, name) {
  return ctx.app.model.getService(name);
}
