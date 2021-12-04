
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

  get _dependencies() {
    return this._serviceClass.deps;
  }

  /**
   *
   * @returns Dereferenced service (result of `block` or `class` constructor)
   */
  get(options) {
    if (this._instance) {
      return this._instance;
    }

    if (this._block) {
      this._instance = this._block();
    } else {
      this._instance = new this._serviceClass();
      const dependencies = this._resolveDependencies(options);
      for (const [dependencyName, dependencyObject] of Object.entries(dependencies)) {
        this._instance[dependencyName] = dependencyObject;
      }
    }

    return this._instance;
  }

  _resolveDependencies(options) {
    if (!this._dependencies) return {};

    this.isLocked = true;
    const root = this._rootContainer;
    const resolvedDeps = {};

    for (let [dependencyName, dependencyPath] of Object.entries(this._dependencies)) {
      const dependencyServiceGetOptions = { };
      const isWeak = dependencyPath.substring(0, 5) === 'weak:';

      if (isWeak) {
        dependencyServiceGetOptions.weakFrom = this;
        dependencyPath = dependencyPath.substring(5);
      }

      if (!dependencyPath.startsWith('/')) {
        throw new Error(`dependency path should be absolute (${dependencyPath})`);
      }

      const service = root.fetch(dependencyPath);

      if (service.isLocked && !isWeak && options.weakFrom !== service)
        throw new Error(`circular dependency forbidden (${dependencyName})`);

      let dependencyObject = service.get(dependencyServiceGetOptions);

      if (isWeak) {
        dependencyObject = new WeakRef(dependencyObject);
      }

      resolvedDeps[dependencyName] = dependencyObject;
    }

    this.isLocked = false;

    return resolvedDeps;
  }
}
