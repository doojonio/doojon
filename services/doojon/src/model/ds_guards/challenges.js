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
          criterionType: { type: 'string', maxLength: 16 },
          title: { type: 'string', maxLength: 100 },
          authorId: { type: ['string', 'null'], maxLength: 36 },
          description: { type: 'string', maxLength: 10000 },
          isPublic: { type: 'boolean' },
        },
        required: ['criterionType', 'title', 'description', 'isPublic'],
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
      maxItems: 7,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: [
          'criterionType',
          'id',
          'title',
          'authorId',
          'description',
          'isPublic',
          'created',
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
          criterionType: { type: 'string', maxLength: 16 },
          id: { type: 'string', maxLength: 11 },
          title: { type: 'string', maxLength: 100 },
          authorId: { type: ['string', 'null'], maxLength: 36 },
          description: { type: 'string', maxLength: 10000 },
          isPublic: { type: 'boolean' },
        },
        required: ['id'],
      },
    };
  }
}
