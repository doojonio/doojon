import mojo from '@mojojs/mojo';

export default async function startup(app) {
  const file = app.home.sibling('doojon.json').toString();
  app.plugin(mojo.jsonConfigPlugin, { file });
}
