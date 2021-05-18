const SUBCOMMANDS = {
  generate: cliGenerate
};

export default async function run(app, args) {

  const subcommand = SUBCOMMANDS[args[1]];

  if (!subcommand) {
    throw Error(`No such subcommand`);
  }

  await subcommand.call(app);
}

async function cliGenerate(app) {

}
