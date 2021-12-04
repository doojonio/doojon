import { FailedAuthError, ValidationError } from '../errors.js';

export default class AuthService {
  static get deps() {
    return {
      _stateChecker: '/s/state_checker',
      _validator: '/s/validator',
      _sessions: '/s/sessions',
      _crypt: '/s/crypt',
      _profiles: '/ds/profiles',
    };
  }

  constructor() {
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
  }

  onInit() {
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

  async signUp(state, credentials) {
    this._stateChecker.ensureNotAuthorized(state);

    const [keys] = await this._profiles.create(state, [credentials]);
    const sessionId = await this._sessions.create(state, keys.id);

    return {
      profileId: keys.id,
      sessionId,
    };
  }

  async signIn(state, credentials) {
    this._stateChecker.ensureNotAuthorized(state);

    if (!this._validateSigninCreds(credentials)) {
      throw new ValidationError(
        this._validator.errorsText(this._validateSigninCreds.errors)
      );
    }

    const idAndPassword = await this._profiles.getIdAndPasswordByEmail(
      state,
      credentials.email
    );

    const areEqual = await this._crypt.comparePasswords(
      credentials.password,
      idAndPassword.password
    );

    if (!areEqual) {
      throw new FailedAuthError();
    }

    const profileId = idAndPassword.id;
    const sessionId = await this._sessions.create(state, profileId);

    return {
      sessionId,
      profileId,
    };
  }
}
