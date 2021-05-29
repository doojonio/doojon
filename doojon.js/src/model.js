import Pg from 'knex';
import Container from './breadboard.js';
import Dataservice from './model/dataservice.js';
import { schema } from './model/schema.js';

export default class Model {
  constructor(conf) {
    this._container = new Container();
    this._conf = conf;

    const steps = ['Handlers', 'Dataservices', 'Services'];

    for (const step of steps) {
      this[`_init${step}`]();
    }
  }

  getDataservice(name) {
    return this._container.resolve(`/ds/${name}`);
  }

  _initHandlers() {
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

  _initDataservices() {
    const ds = this._container.addContainer('ds');
    ds.addService('ds', { isSingletone: true, class: Dataservice });
  }

  _initServices() {
    this._services = [];
  }
}
