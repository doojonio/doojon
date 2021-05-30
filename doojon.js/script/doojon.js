#!/usr/bin/env node

import startup from '../src/startup.js';

(async function main() {
  const app = await startup();
  app.start();
})();
