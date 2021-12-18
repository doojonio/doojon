import { NotAuthorizedError, ValidationError } from './errors.js';

export class DataserviceGuard {
  static get _objectsCreateSchema() {}
  static get _columnsReadSchema() {}
  static get _keysSchema() {}
  static get _rowsUpdateSchema() {}

  _guardReadNeededFields = [];

  constructor() {
    /**
     * @type {import('ajv').default}
     */
    this._validator;
  }

  onInit() {
    this._validateKeys = this._validator.compile(this.constructor._keysSchema);
    this._validateCreateWhat = this._validator.compile(
      this.constructor._objectsCreateSchema
    );
    this._validateReadColumns = this._validator.compile(
      this.constructor._columnsReadSchema
    );
    this._validateUpdateRows = this._validator.compile(
      this.constructor._rowsUpdateSchema
    );
  }

  static get deps() {
    return Object.assign(
      {
        _validator: '/s/validator',
        _config: '/conf',
      },
      this._customDeps
    );
  }
  static get _customDeps() {
    return {};
  }

  async preCreateCheck(rows) {
    if (!this._validateCreateWhat(rows)) {
      throw new ValidationError(
        this._validator.errorsText(this._validateCreateWhat.errors)
      );
    }

    return this._preCreateAdditionalChecks(rows);
  }

  async _preCreateAdditionalChecks(_rows) {}

  async preReadCheck(keys, columns) {
    if (!this._validateKeys(keys)) {
      throw new ValidationError(
        'keys - ' + this._validator.errorsText(this._validateKeys.errors)
      );
    }
    if (!this._validateReadColumns(columns)) {
      throw new ValidationError(
        'columns - ' +
          this._validator.errorsText(this._validateReadColumns.errors)
      );
    }

    return this._preReadAdditionalChecks(keys, columns);
  }

  async _preReadAdditionalChecks(keys, _columns) {}

  async preUpdateCheck(rows) {
    if (!this._validateUpdateRows(rows)) {
      throw new ValidationError(
        this._validator.errorsText(this._validateUpdateRows.errors)
      );
    }

    return this._preUpdateAdditionalChecks(rows);
  }
  async _preUpdateAdditionalChecks(_rows) {}

  async preDeleteCheck(keys) {
    if (!this._validateKeys(keys)) {
      throw new ValidationError(
        this._validator.errorsText(this._validateKeys.errors)
      );
    }

    return this._preDeleteAdditionalChecks(keys);
  }
  async _preDeleteAdditionalChecks(_keys) {}
}
