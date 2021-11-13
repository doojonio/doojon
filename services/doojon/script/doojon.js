#!/usr/bin/env node

import { startup } from '../src/lib.js';

(async function main() {
  const app = await startup();
  await app.start();
})();
