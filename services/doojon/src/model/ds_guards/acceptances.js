import { DataserviceGuard } from '../ds_guard.js';

export default class AcceptancesGuard extends DataserviceGuard {
  static get _tableName() {
    return 'Acceptances';
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
          profileId: { type: 'string', maxLength: 36 },
          status: { type: 'string', maxLength: 16 },
        },
        required: ['challengeId', 'profileId', 'status'],
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
        enum: [
          'challengeId',
          'profileId',
          'updated',
          'id',
          'created',
          'status',
        ],
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
          profileId: { type: 'string', maxLength: 36 },
          id: { type: 'string', maxLength: 26 },
          status: { type: 'string', maxLength: 16 },
        },
        required: ['id'],
      },
    };
  }
}
