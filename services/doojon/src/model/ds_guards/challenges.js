import { DataserviceGuard } from '../ds_guard.js';

export default class ChallengesGuard extends DataserviceGuard {
  static get _tableName() {
    return 'Challenges';
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
          criterionType: { type: 'integer' },
          isPublic: { type: 'boolean' },
          authorId: { type: ['string', 'null'], maxLength: 36 },
        },
        required: ['criterionType', 'isPublic'],
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
      maxItems: 5,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ['criterionType', 'isPublic', 'authorId', 'id', 'created'],
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
          criterionType: { type: 'integer' },
          isPublic: { type: 'boolean' },
          authorId: { type: ['string', 'null'], maxLength: 36 },
          id: { type: 'string', maxLength: 11 },
        },
        required: ['id'],
      },
    };
  }
}
