import mojo from '@mojojs/mojo';

export default async function startup(app) {
  const configFile = new mojo.File(app.home.toString(), '../doojon.json');
  Object.assign(app.config, await configFile.readFile().then(JSON.parse));
}
