export default class Container {
  constructor(parentContainer) {
    this._containers = {};
    this._services = {};

    if (parentContainer) {
      this._parentRef = new WeakRef(parentContainer);
    }
  }

  addService(serviceName, conf) {
    if (this._services[serviceName]) {
      throw new Error(`service ${serviceName} already exists`);
    }

    const service = new Service(conf, this);
    this._services[serviceName] = service;

    return service;
  }

  addContainer(containerName) {
    if (this._containers[containerName]) {
      throw new Error(`container ${containerName} already exists`);
    }

    const container = new Container(this);
    this._containers[containerName] = container;

    return container;
  }

  getContainer(containerName) {
    const container = this._containers[containerName];

    if (!container) throw new Error(`no such container ${containerName}`);

    return container;
  }

  getService(serviceName) {
    const service = this._services[serviceName];

    if (!service) throw new Error(`no such service ${service}`);

    return service;
  }

  fetch(path, isContainer = false) {
    path = path.split('/').filter(el => el);

    if (path.length === 0) return this;

    const lastEl = path.pop();

    let currentContainer = this;
    for (let containerName of path) {
      currentContainer = currentContainer.getContainer(containerName);
    }

    if (isContainer) {
      return currentContainer.getContainer(lastEl);
    }

    return currentContainer.getService(lastEl);
  }

  resolve(path) {
    return this.fetch(path).get();
  }
}

class Service {
  constructor(conf, parentContainer) {
    if (!parentContainer)
      throw new Error('missing parent container for service');

    if (conf.block) {
      this._block = conf.block;
    } else if (conf.class) {
      this._serviceClass = conf.class;
    } else {
      throw new Error('missing block or class');
    }

    this.isLocked = false;
    this._isSingletone = conf.isSingletone || false;
    this._parentRef = new WeakRef(parentContainer);
  }

  get _rootContainer() {
    let container = this._parentRef.deref();

    while (container._parentRef) {
      container = container._parentRef.deref();
    }

    return container;
  }

  get _deps() {
    return this._serviceClass.deps;
  }

  get() {
    if (this._isSingletone && this._instance) {
      return this._instance;
    }

    let object;
    if (this._block) {
      object = this._block();
    } else {
      const deps = this._resolveDependencies();
      object = new this._serviceClass(deps);
    }

    if (this._isSingletone) this._instance = object;

    return object;
  }

  _resolveDependencies() {
    if (!this._deps) return {};

    this.isLocked = true;
    const root = this._rootContainer;
    const resolvedDeps = {};

    for (const [depName, depPath] of Object.entries(this._deps)) {
      if (!depPath.startsWith('/')) {
        throw new Error(`dependency path should be absolute (${depPath})`);
      }

      const service = root.fetch(depPath);

      if (service.isLocked)
        throw new Error(`circular dependency forbidden (${depName})`);

      resolvedDeps[depName] = service.get();
    }

    this.isLocked = false;

    return resolvedDeps;
  }
}
