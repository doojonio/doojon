/**
 * General class for services. Use it in pair with `breadboard.js`.
 * Every service constructor will expect object with dependencies.
 * Dependencies of a service described in `deps` getter in `{name: absolutePathInBreadBoard}` form.
 * Construct will expect every dependency to be accessed on the same key as it described
 * in `deps` getter and insert every dependency as attribute of the created object
 */
export class Service {
  /**
   * @type {Object}
   */
  static get deps() {
    return {};
  }

  /**
   *
   * @param {Object} deps - Object with all dependencies
   */
  constructor(deps) {
    for (const depName in this.constructor.deps) {
      this[depName] = deps[depName];
    }
  }
}

export class Container {
  constructor(parentContainer) {
    this._containers = {};
    this._services = {};

    if (parentContainer) {
      this._parentRef = new WeakRef(parentContainer);
    }
  }

  initAll() {
    for (const service of Object.values(this._services)) {
      service.get();
    }

    for (const container of Object.values(this._containers)) {
      container.initAll();
    }
  }

  /**
   *
   * @param {string} serviceName
   * @param {Object} conf
   * @returns {ContainerService}
   */
  addService(serviceName, conf) {
    if (this._services[serviceName]) {
      throw new Error(`service ${serviceName} already exists`);
    }

    const service = new ContainerService(conf, this);
    this._services[serviceName] = service;

    return service;
  }

  listServices() {
    return Object.keys(this._services);
  }

  /**
   *
   * @param {string} containerName
   * @returns {Container} container
   */
  addContainer(containerName) {
    if (this._containers[containerName]) {
      throw new Error(`container ${containerName} already exists`);
    }

    const container = new Container(this);
    this._containers[containerName] = container;

    return container;
  }

  /**
   *
   * @param {string} containerName
   * @returns {Container}
   */
  getContainer(containerName) {
    const container = this._containers[containerName];

    if (!container) throw new Error(`no such container ${containerName}`);

    return container;
  }

  /**
   *
   * @param {string} serviceName
   * @returns {ContainerService}
   */
  getService(serviceName) {
    const service = this._services[serviceName];

    if (!service) throw new Error(`no such service ${serviceName}`);

    return service;
  }

  /**
   *
   * @param {string} path
   * @param {boolean} isContainer
   * @returns {ContainerService | Container}
   */
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

  /**
   *
   * @param {string} path
   * @returns Dereferenced service (result of `block` or `class` constructor)
   */
  resolve(path) {
    return this.fetch(path).get();
  }
}

class ContainerService {
  constructor(conf, parentContainer) {
    if (!parentContainer) {
      throw new Error('Missing parent container for service');
    }

    if (conf.block) {
      this._block = conf.block;
    } else if (conf.class) {
      this._serviceClass = conf.class;
    } else {
      throw new Error('Missing block or class');
    }

    this.isLocked = false;
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

  /**
   *
   * @returns Dereferenced service (result of `block` or `class` constructor)
   */
  get() {
    if (this._instance) {
      return this._instance;
    }

    let object;
    if (this._block) {
      object = this._block();
    } else {
      const deps = this._resolveDependencies();
      object = new this._serviceClass(deps);
    }

    this._instance = object;

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
