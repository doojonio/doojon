const { File } = require('@mojojs/mojo');
const Pg = require('knex');
const Container = require('./breadboard');
const schema = require('./model/schema');

class Model {
  constructor(conf) {
    this._container = new Container();
    this._conf = conf;
  }

  async init() {
    const steps = ['Couriers', 'Handlers', 'Dataservices', 'Services'];

    for (const step of steps) {
      await this[`_init${step}`]();
    }
  }

  getDataservice(name) {
    return this._container.resolve(`/ds/${name}`);
  }

  getCourier(name) {
    return this._container.resolve(`/c/${name}`);
  }

  listDataservices() {
    return this._container.fetch('/ds', true).listServices();
  }

  async closeHandlers() {
    this._container.resolve('/h/db').destroy();
  }

  async _initCouriers() {
    const c = this._container.addContainer('c');
    const couriersdir = new File(this._conf.couriers.directory);

    for await (const courierfile of couriersdir.list()) {
      const couriername = courierfile.basename('.js');
      const courierclass = require(courierfile.toString());
      const courierconf = this._conf.couriers[couriername];

      if (!courierconf)
        throw new Error(`missing conf for courier ${couriername}`);

      c.addService(couriername, { block: () => new courierclass(courierconf) });
    }
  }

  async _initHandlers() {
    const h = this._container.addContainer('h');
    const conf = this._conf;

    const dbBlock = () =>
      new Pg({
        client: 'pg',
        connection: conf.database,
        migrations: conf.migrations,
      });

    h.addService('db', { block: dbBlock, isSingletone: true });
    const dbcont = h.addContainer('db');
    dbcont.addService('schema', { block: () => schema, isSingletone: true });
  }

  async _initDataservices() {
    const ds = this._container.addContainer('ds');
    const dsdir = new File(this._conf.dataservices.directory);

    for await (const dsfile of dsdir.list()) {
      const dsname = dsfile.basename('.js');
      const dsclass = require(dsfile.toString());
      ds.addService(dsname, { isSingletone: true, class: dsclass });
    }
  }

  async _initServices() {}
}

module.exports = Model;
