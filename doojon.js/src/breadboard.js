
export class Container {

  constructor(parentContainer) {
    this._containers = {};
    this._services = {};

    if (parentContainer) {
      this._parentRef = new WeakRef(parentContainer);
    }
  }

  addService(serviceName, serviceClass, conf) {

    if (this._services[serviceName]) {
      throw new Error(`service ${serviceName} already exists`);
    }

    const service = new Service(serviceClass, conf, this);
    this._services[serviceName] = service;

    return service;
  }

  addContainer(containerName) {

    if(this._containers[containerName]) {
      throw new Error(`container ${containerName} already exists`)
    }

    const container = new Container(this);
    this._containers[containerName] = container;

    return container;
  }

  resolve(path) {
  }
}

export class Service {

  constructor(serviceClass, {isSingletone}, parentContainer) {

    if (!serviceClass) throw new Error('missing class for service')
    if (!parentContainer) throw new Error('missing parent container for service')

    this._serviceClass = serviceClass;
    this._isLocked = false;
    this._isSingletone = isSingletone || false;
    this._parentRef = new WeakRef(parentContainer);
  }

  get() {

    if (this._isSingletone && this._instance) {
      return this._instance;
    }

    const deps = this._resolveDependencies();
    const object = new this.serviceClass(deps);

    if (this._isSingletone) this._instance = object;

    return object
  }

  _resolveDependencies() {
    //TODO
  }
}
