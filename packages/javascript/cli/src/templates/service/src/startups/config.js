import { jsonConfigPlugin } from '@mojojs/core';

export default async function configStartup(app) {
  let file = process.env.DOOJON_CONFIG ?? 'cfg/doojon.json';
  app.plugin(jsonConfigPlugin, { file });
}
