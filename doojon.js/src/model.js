import Pg from 'knex';

export default class Model {

  constructor(conf) {

    this._db = new Pg({
      client: 'pg',
      connection: conf.database,
      migrations: conf.migrations,
    });

    [
      'Handlers',
      'Dataservices',
      'Services'
    ].forEach(serviceContainer => {
      this[`_init${serviceContainer}`](conf)
    })

    this._initDataservices();
    this._initServices();
  }

  _initHandlers(conf) {
  }

  _initDataservices(conf) {
    this._datservices = [];
  }

  _initServices(conf) {
    this._services = [];
  }

}
