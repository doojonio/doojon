import { DataserviceGuard } from '../ds_guard.js';

export default class ProgressesByTDPPGuard extends DataserviceGuard {
  static get _tableName() {
    return 'ProgressesByTDPP';
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
          periodsNum: { type: ['integer', 'null'] },
          period: { type: 'integer' },
          times: { type: 'integer' },
          acceptanceId: { type: 'string', maxLength: 26 },
        },
        required: ['period', 'times', 'acceptanceId'],
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
        description: 'acceptanceId',
        items: { type: 'string' },
      },
    };
  }

  static get _columnsReadSchema() {
    return {
      type: 'array',
      minItems: 1,
      maxItems: 4,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['periodsNum', 'period', 'times', 'acceptanceId'],
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
          periodsNum: { type: ['integer', 'null'] },
          period: { type: 'integer' },
          times: { type: 'integer' },
          acceptanceId: { type: 'string', maxLength: 26 },
        },
        required: ['acceptanceId'],
      },
    };
  }
}
