import mojo from '@mojojs/mojo';
import Pg from 'knex';
import Container from './breadboard.js';
import Dataservice from './model/dataservice.js';
import { schema } from './model/schema.js';

export default class Model {
  constructor(conf) {
    this._container = new Container();
    this._conf = conf;
  }

  async init() {
    const steps = ['Handlers', 'Dataservices', 'Services'];

    for (const step of steps) {
      await this[`_init${step}`]();
    }
  }

  getDataservice(name) {
    return this._container.resolve(`/ds/${name}`);
  }

  listDataservices() {
    return this._container.fetch('/ds', true).listServices();
  }

  async closeHandlers() {
    this._container.resolve('/h/db').destroy();
  }

  async _initHandlers() {
    const h = this._container.addContainer('h');

    const dbBlock = () => {
      return new Pg({
        client: 'pg',
        connection: this._conf.database,
        migrations: this._conf.migrations,
      });
    };
    dbBlock.bind(this);

    h.addService('db', { block: dbBlock, isSingletone: true });
    const dbcont = h.addContainer('db');
    dbcont.addService('schema', { block: () => schema, isSingletone: true });
  }

  async _initDataservices() {
    const ds = this._container.addContainer('ds');
    const dsdir = new mojo.File(this._conf.dataservices.directory);

    for await (const dsfile of dsdir.list()) {
      const dsname = dsfile.basename('.js');
      const dsclass = (await import(dsfile.toString())).default;
      ds.addService(dsname, { isSingletone: true, class: dsclass });
    }
  }

  async _initServices() {}
}
