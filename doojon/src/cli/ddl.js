/**
 * @typedef {import('@mojojs/core').MojoApp} App
 */

/**
 * @this {App}
 */
async function cliRun(args) {
  const statements = (
    await import(this.home.child('src/ddl_statements/1.js').toString())
  ).DDL_STATEMENTS;

  if (!Array.isArray(statements) || statements.length < 1) {
    console.log('No statements found in specicfied file or they are not array');
    process.exit(1);
  }

  /**
   * @type {import('@google-cloud/spanner').Database}
   */
  const database = this.model._container.resolve('/h/db');
  database.updateSchema(statements);
}

export default async function run(app, args) {
  const subcli = args[1];

  if (!subcli) {
    console.log('no subcommand specified');
    process.exit(1);
  }

  const subCommands = {
    run: cliRun,
  };

  const fn = subCommands[subcli];

  if (fn === undefined) {
    console.log(`no subsuch command ${subcli}`);
    process.exit(1);
  }

  await fn.call(app, args);

  app.model.closeAllConnections();
}
