import { Container } from '@doojon/breadboard';

export class Model {
  constructor(deps) {
    this._container = new Container();

    this._conf = deps.conf;

    /**
     * @type {import('@mojojs/core').File}
     */
    this._appHome = deps.home;
    this._container.addService('conf', { block: () => deps.conf });

    this._log = deps.log;
  }

  async init() {
    const steps = [
      'handlers',
      'ds_stewards',
      'ds_guards',
      'dataservices',
      'services',
    ];

    for (const step of steps) {
      const modulePath = this._appHome
        .child(`src/model_startups/${step}.js`)
        .toString();
      const fn = (await import(modulePath.toString())).default;
      await fn.apply(this);
    }

    this._container.initAll();

    if (process.env['DOOJON_RUN_DB_MIGRATIONS'] === '1') {
      await this._container.resolve('/h/db').migrate.latest();
    }
  }

  closeAllConnections() {
    this._container.resolve('/h/db').close();
    this._container.resolve('/h/redis').disconnect();
  }

  getDataservice(name) {
    return this._container.resolve(`/ds/${name}`);
  }

  getDsGuard(name) {
    return this._container.resolve(`/ds_guards/${name}`);
  }

  getService(name) {
    return this._container.resolve(`/s/${name}`);
  }

  listDataservices() {
    return this._container.fetch('/ds', true).listServices();
  }
}
