import Pg from 'knex';

export default class Model {

  constructor(conf) {

    this._db = new Pg({
      client: 'pg',
      connection: conf.database,
      migrations: conf.migrations,
    });

    this._initDataservices();
    this._initServices();
  }

  _initDataservices() {
    this._datservices = [];
  }

  _initServices() {
    this._services = [];
  }

}