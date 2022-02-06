export class Container {
  constructor(parentContainer, containerName) {
    this._containers = {};
    this._services = {};

    if (parentContainer) {
      this._parentRef = new WeakRef(parentContainer);
      this.name = containerName;
    } else {
      this._classMap = new Map();
    }
  }

  setClassMapping(servicePath, dependencyClass) {
    this._classMap.set(servicePath, dependencyClass);
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

    const service = new ContainerService(conf, this, serviceName);
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

    const container = new Container(this, containerName);
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
    if (typeof path !== "string" && isContainer) {
      throw new Error("Only string allowed as path to fetch container");
    }
    if (path instanceof Function && this._parentRef !== undefined) {
      throw new Error("Fetching by class allowed only in root container");
    }

    if (path instanceof Function) {
      for (const [servicePath, depClass] of this._classMap.entries()) {
        if (depClass === path) {
          path = servicePath;
          break;
        }
      }

      if (path instanceof Function) {
        throw new Error(`No service found for class ${path.name}`);
      }
    }

    path = path.split("/").filter(el => el);

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
   * @param {string | Function } path
   * @returns Dereferenced service (result of `block` or `class` constructor)
   */
  resolve(path) {
    return this.fetch(path).get();
  }
}

class ContainerService {
  constructor(conf, parentContainer, serviceName) {
    if (!parentContainer) {
      throw new Error("Missing parent container for service");
    }

    this.isLocked = false;
    this._serviceName = serviceName;
    this._parentRef = new WeakRef(parentContainer);

    if (conf.block) {
      this._block = conf.block;
    } else if (conf.class) {
      this._serviceClass = conf.class;

      const [root, pathToService] = this._rootContainer;
      root.setClassMapping(pathToService, conf.class);
    } else {
      throw new Error("Missing block or class");
    }
  }

  get _rootContainer() {
    let container = this._parentRef.deref();

    const pathParts = [this._parentRef.name, this._serviceName];

    while (container._parentRef !== undefined) {
      container = container._parentRef.deref();
      pathParts.unshift(container.name);
    }

    const path = "/" + pathParts.join("/");

    return [container, path];
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
      for (const [dependencyName, dependencyObject] of Object.entries(
        dependencies
      )) {
        this._instance[dependencyName] = dependencyObject;
      }
    }

    if (this._instance.onInit instanceof Function) {
      this._instance.onInit();
    }

    return this._instance;
  }

  _resolveDependencies(options) {
    if (!this._dependencies) return {};

    this.isLocked = true;
    const [root] = this._rootContainer;
    const resolvedDeps = {};

    for (let [dependencyName, dependencyPath] of Object.entries(
      this._dependencies
    )) {
      const dependencyServiceGetOptions = {};
      let isWeak = false;

      if (typeof dependencyPath === "string") {
        isWeak = dependencyPath.substring(0, 5) === "weak:";
        if (isWeak) {
          dependencyServiceGetOptions.weakFrom = this;
          dependencyPath = dependencyPath.substring(5);
        }
        if (!dependencyPath.startsWith("/")) {
          throw new Error(
            `dependency path should be absolute (${dependencyPath})`
          );
        }
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
