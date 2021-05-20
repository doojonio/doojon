import Pg from 'knex';
import Container from './breadboard.js';

export default class Model {

  constructor(conf) {

    this._container = new Container();
    this._conf = conf;

    [
      'Handlers',
      'Dataservices',
      'Services'
    ].forEach(serviceContainer => {
      this[`_init${serviceContainer}`](conf)
    })
  }

  _initHandlers(conf) {
    const h = this._container.addContainer('h');

    const dbBlock = () => {
      return new Pg({
        client: 'pg',
        connection: this._conf.database,
        migrations: this._conf.migrations,
      })
    };
    dbBlock.bind(this);

    h.addService('db', {block: dbBlock, isSingletone: true})
  }

  _initDataservices(conf) {
  }

  _initServices(conf) {
    this._services = [];
  }

}
