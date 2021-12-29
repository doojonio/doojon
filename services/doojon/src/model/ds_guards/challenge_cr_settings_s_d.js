import { DataserviceGuard } from '../ds_guard.js';

export default class ChallengeCrSettingsSDGuard extends DataserviceGuard {
  static get _tableName() {
    return 'ChallengeCrSettingsSD';
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
          challengeId: { type: 'string', maxLength: 11 },
          minNeedToSpend: { type: 'integer' },
          maxNeedToSpend: { type: ['integer', 'null'] },
        },
        required: ['challengeId', 'minNeedToSpend'],
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
        description: 'challengeId',
        items: { type: 'string' },
      },
    };
  }

  static get _columnsReadSchema() {
    return {
      type: 'array',
      minItems: 1,
      maxItems: 3,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['challengeId', 'minNeedToSpend', 'maxNeedToSpend'],
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
          challengeId: { type: 'string', maxLength: 11 },
          minNeedToSpend: { type: 'integer' },
          maxNeedToSpend: { type: ['integer', 'null'] },
        },
        required: ['challengeId'],
      },
    };
  }
}
