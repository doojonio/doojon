export default async function startup() {
  const ds = this._container.addContainer('ds');
  const dsdir = this._appHome.child('src/model/dataservices');

  for await (const dsfile of dsdir.list()) {
    const dsname = dsfile.basename('.js');
    const dsclass = (await import(dsfile.toString())).default;
    ds.addService(dsname, { isSingletone: true, class: dsclass });
  }
}
