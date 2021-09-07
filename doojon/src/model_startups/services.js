export default async function startup() {
  const s = this._container.addContainer('s');
  const servicesDir = this._appHome.child('src/model/services');

  for await (const serviceFile of servicesDir.list()) {
    const serviceName = serviceFile.basename('.js');
    const serviceClass = (await import(serviceFile.toString())).default;
    s.addService(serviceName, { isSingletone: true, class: serviceClass });
  }
}
