import { Container } from './breadboard.js';

export class Model {
  constructor(deps) {
    this._container = new Container();

    this._conf = deps.conf;
    this._appHome = deps.home;
    this._container.addService('conf', { block: () => deps.conf });

    this._log = deps.log;
  }

  async init() {
    const steps = ['couriers', 'handlers', 'dataservices', 'services'];

    for (const step of steps) {
      const modulePath = this._appHome.child(`src/model_startups/${step}.js`).toString();
      const fn = (await import(modulePath.toString())).default;
      fn.apply(this);
    }

    if (process.env['DOOJON_RUN_DB_MIGRATIONS'] === '1') {
      await this._container.resolve('/h/db').migrate.latest();
    }
  }

  getDataservice(name) {
    return this._container.resolve(`/ds/${name}`);
  }

  getService(name) {
    return this._container.resolve(`/s/${name}`);
  }

  getCourier(name) {
    return this._container.resolve(`/c/${name}`);
  }

  listDataservices() {
    return this._container.fetch('/ds', true).listServices();
  }
}
