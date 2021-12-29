import { DataserviceGuard } from '../ds_guard.js';

export default class ProgressesBySDGuard extends DataserviceGuard {
  static get _tableName() {
    return 'ProgressesBySD';
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
          finishedOnDay: { type: ['integer', 'null'] },
          acceptanceId: { type: 'string', maxLength: 26 },
          needToSpend: { type: ['integer', 'null'] },
        },
        required: ['acceptanceId'],
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
      maxItems: 3,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['finishedOnDay', 'acceptanceId', 'needToSpend'],
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
          finishedOnDay: { type: ['integer', 'null'] },
          acceptanceId: { type: 'string', maxLength: 26 },
          needToSpend: { type: ['integer', 'null'] },
        },
        required: ['acceptanceId'],
      },
    };
  }
}
