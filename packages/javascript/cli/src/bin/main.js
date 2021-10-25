#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { newService } from '../new_service.js';

yargs(hideBin(process.argv))
  .command('new', 'Generate new subproject', yargs => {
    yargs
      .command('service <name>', 'Generate new service', yargs => {
        yargs.positional('name', {
          describe: "new service's name",
        })
      }, newService)
      .demandCommand(1);
  })
  .demandCommand(1)
  .parse();
