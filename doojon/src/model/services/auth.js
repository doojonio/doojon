import { NotAuthorizedError, NotFoundError, ValidationError } from '../errors.js';
import { Service } from '../service.js';

export default class AuthService extends Service {
  static get deps() {
    return {
      _stateChecker: '/s/state_checker',
      _validator: '/s/validator',
      _sessions: '/s/sessions',
      _crypt: '/s/crypt',
      _profiles: '/ds/profiles',
    };
  }

  constructor(...args) {
    super(...args);

    /**
     * @type {import('./state_checker').default}
     */
    this._stateChecker;

    /**
     * @type {import('../dataservices/profiles').default}
     */
    this._profiles;

    /**
     * @type {import('./sessions').default}
     */
    this._sessions;

    /**
     * @type {import('./crypt').default}
     */
    this._crypt;

    /**
     * @type {import('ajv').default}
     */
    this._validator;

    const signinCredsSchema = {
      type: 'object',
      additionalProperties: false,
      properties: {
        email: { type: 'string', minLength: 3, maxLength: 320 },
        password: { type: 'string', minLength: 8, maxLength: 32 },
      },
      required: ['email', 'password'],
    };

    this._validateSigninCreds = this._validator.compile(signinCredsSchema);
  }

  async signup(state, credentials) {
    this._stateChecker.ensureNotAuthorized(state);

    const [keys] = await this._profiles.create(state, [credentials]);
    const sessionId = await this._sessions.create(state, keys.id);

    return {
      profileId: keys.id,
      sessionId,
    };
  }

  async signin(state, credentials) {
    this._stateChecker.ensureNotAuthorized(state);

    if (!this._validateSigninCreds(credentials)) {
      throw new ValidationError(
        this._validator.errorsText(this._validateSigninCreds.errors)
      );
    }

    const idAndPassword = await this._profiles.getIdAndPasswordByEmail(state, credentials.email);

    const areEqual = await this._crypt.comparePasswords(credentials.password, idAndPassword.password);

    if (!areEqual) {
      throw new NotAuthorizedError('Password is incorrect');
    }

    const profileId = idAndPassword.id;
    const sessionId = this._sessions.create(state, profileId);

    return {
      sessionId,
      profileId,
    }
  }
}
