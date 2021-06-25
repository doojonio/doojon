export class Service {
  static get deps() {
    return {};
  }

  constructor(deps) {
    for (const depName in this.constructor.deps) {
      this[depName] = deps[depName];
    }
  }
}
