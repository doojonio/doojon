#!/usr/bin/env node
import mojo from '@mojojs/mojo';
import startup from './startup.js'

const app = mojo();

try {
  await startup(app);
}
catch (e) {
  throw Error(`Unable to configure app: ${e}`)
}

app.start()

