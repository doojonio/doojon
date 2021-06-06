#!/usr/bin/env node

const startup = require('../src/startup');

(async function main() {
  const app = await startup();
  app.start();
})();
