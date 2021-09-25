export default async function startup() {
  const c = this._container.addContainer('c');
  const couriersdir = this._appHome.child('src/model/couriers');

  for await (const courierfile of couriersdir.list()) {
    const couriername = courierfile.basename('.js');
    const courierclass = (await import(courierfile.toString())).default;
    const courierconf = this._conf.couriers[couriername];

    if (!courierconf)
      throw new Error(`missing conf for courier ${couriername}`);

    c.addService(couriername, {
      block: () => new courierclass(courierconf),
    });
  }
}
