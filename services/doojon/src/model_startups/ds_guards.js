export default async function startup() {
  const dsGuards = this._container.addContainer('ds_guards');
  const dsGuardsDir = this._appHome.child('src/model/ds_guards');

  for await (const file of dsGuardsDir.list()) {
    const name = file.basename('.js');
    const serviceClass = (await import(file.toString())).default;
    dsGuards.addService(name, { class: serviceClass });
  }
}
