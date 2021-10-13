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
