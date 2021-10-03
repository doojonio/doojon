import Ajv from 'ajv';

/**
 * @this {import('../model.js').Model}
 */
export default async function startup() {
  const s = this._container.addContainer('s');

  s.addService('validator', { block: setupValidator });

  const servicesDir = this._appHome.child('src/model/services');

  for await (const serviceFile of servicesDir.list()) {
    const serviceName = serviceFile.basename('.js');
    const serviceClass = (await import(serviceFile.toString())).default;
    s.addService(serviceName, { class: serviceClass });
  }
}

function setupValidator() {
  return new Ajv();
}
