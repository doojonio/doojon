const SUBCOMMANDS = {
  add: cliAdd,
  run: cliRun,
  rollback: cliRollback,
};

export default async function run(app, args) {

  const subcommand = SUBCOMMANDS[args[1]];

  if (!subcommand) {
    throw new Error(`No such subcommand`);
  }

  await subcommand.call(this, app, args.slice(2));
}

async function cliAdd(app, args) {

  app.model._db.migrate.make(args[0]);
}

async function cliRun(app) {

  app.model._db.migrate.latest().then(() => {
    app.model._db.destroy()
  });
}

async function cliRollback(app) {

  await app.model._db.migrate.rollback().then(() => {
    app.model._db.destroy()
  });
}
