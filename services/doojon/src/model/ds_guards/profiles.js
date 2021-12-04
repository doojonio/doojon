import { DataserviceGuard } from '../ds_guard.js';
import { ConflictError, ForbiddenError } from '../errors.js';
import { IdStatus } from '../state.js';

/**
 * @typedef {import('../state.js').State} State
 * @typedef {import('../dataservices/profiles').default} ProfilesDataservice
 */

export default class ProfilesGuard extends DataserviceGuard {
  static get _tableName() {
    return 'Profiles';
  }

  static get _customDeps() {
    return {
      _ds: 'weak:/ds/profiles'
    }
  }

  static get _objectsCreateSchema() {
    return {
      type: 'array',
      maxItems: 1,
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          username: { type: 'string', maxLength: 16 },
          bio: { type: ['string', 'null'], maxLength: 300 },
          email: { type: 'string', maxLength: 320 },
          password: { type: 'string', minLength: 8, maxLength: 32 },
        },
        required: ['username', 'email', 'password'],
      },
    };
  }

  static get _keysSchema() {
    return {
      type: 'array',
      minItems: 1,
      items: {
        type: 'array',
        minItems: 1,
        maxItems: 1,
        description: 'id',
        items: { type: 'string' },
      },
    };
  }

  static get _columnsReadSchema() {
    return {
      type: 'array',
      minItems: 1,
      maxItems: 6,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['username', 'id', 'bio', 'created'],
      },
    };
  }

  static get _rowsUpdateSchema() {
    return {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        minProperties: 2,
        additionalProperties: false,
        properties: {
          username: { type: 'string', maxLength: 16 },
          id: { type: 'string', maxLength: 36 },
          bio: { type: ['string', 'null'], maxLength: 300 },
          email: { type: 'string', maxLength: 320 },
          password: { type: 'string', minLength: 8, maxLength: 32 },
        },
        required: ['id'],
      },
    };
  }

  /**
   * - User has to be not authorized
   *
   * @param {State} state
   * @param {Array<Object>} objects
   */
  async _preCreateAdditionalChecks(state, profiles) {
    if (state.identity.status !== IdStatus.UNAUTHORIZED) {
      throw new ForbiddenError(
        'User has to be unauthorized to create profiles'
      );
    }

    const forbiddenUsernames =
      this._config.dataservices.profiles.forbiddenUsernames;
    for (const profile of profiles) {
      if (forbiddenUsernames.includes(profile.username)) {
        throw new ForbiddenError(`Username '${profile.username}' is forbidden`);
      }

      if (!await this._ds.deref().isUsernameFree(profile.username)) {
          throw new ConflictError(`Username '${profile.username}' already taken`);
      }
    }

  }
}
