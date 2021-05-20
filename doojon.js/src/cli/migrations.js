const SUBCOMMANDS = {
  add: cliAdd,
  run: cliRun,
  rollback: cliRollback,
};

export default async function run(app, args) {

  const subcommand = SUBCOMMANDS[args[1]];

  if (!subcommand) {
    throw new Error('No such subcommand');
  }

  await subcommand.call(this, app, args.slice(2));
}

async function cliAdd(app, args) {

  const db = app.model._container.resolve('/h/db');
  db.migrate.make(args[0]);
}

async function cliRun(app) {

  const db = app.model._container.resolve('/h/db');

  db.migrate.latest().then(() => {
    db.destroy();
  });
}

async function cliRollback(app) {

  const db = app.model._container.resolve('/h/db');
  db.migrate.rollback().then(() => {
    db.destroy();
  });
}
