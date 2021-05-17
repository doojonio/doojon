import Knex from 'knex';

export default class Model {

  constructor(conf) {

    this._pg = new Knex({
      client: 'pg',
      connection: conf.database
    });

    this._dataservices = this._initDataservices();
    this._services = this._initServices();
  }

  _initDataservices() {
    return []
  }

  _initServices() {
    return []
  }

}