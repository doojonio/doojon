import { ForbiddenError } from './errors';
import { Service } from './service';

export class DataserviceGuard extends Service {
  static get deps() {
    return Object.assign(
      {
        _db: '/h/db',
      },
      this._customdeps
    );
  }
  static get _customdeps() {
    return {};
  }

  async precreateCheck(state, objects) {
    throw new ForbiddenError('create action has been foribdden');
  }

  async precreateAction(state, objects) {}

  async postcreateAction(state, objects) {}

  async prereadCheck(state, where) {
    throw new ForbiddenError('read action has been foribdden');
  }

  async preupdateCheck(state, where, fields) {
    throw new ForbiddenError('update action has been foribdden');
  }

  async predeleteCheck(state, where) {
    throw new ForbiddenError('delete actions has been foribdden');
  }
}
