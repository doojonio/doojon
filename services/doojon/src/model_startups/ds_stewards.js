export default async function startup() {
  const dsStewards = this._container.addContainer('ds_stewards');
  const dsStewardsDir = this._appHome.child('src/model/ds_stewards');

  for await (const file of dsStewardsDir.list()) {
    const name = file.basename('.js');
    const serviceClass = (await import(file.toString())).default;
    dsStewards.addService(name, {
      class: serviceClass,
    });
  }
}
