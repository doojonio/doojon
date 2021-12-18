import { DataserviceGuard } from '../ds_guard.js';

export default class RepliesGuard extends DataserviceGuard {
  static get _tableName() {
    return 'Replies';
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
          commentId: { type: 'string', maxLength: 26 },
          authorId: { type: 'string', maxLength: 36 },
          text: { type: 'string', maxLength: 10000 },
        },
        required: ['commentId', 'authorId', 'text'],
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
        enum: ['commentId', 'authorId', 'id', 'created', 'text'],
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
          commentId: { type: 'string', maxLength: 26 },
          authorId: { type: 'string', maxLength: 36 },
          id: { type: 'string', maxLength: 26 },
          text: { type: 'string', maxLength: 10000 },
        },
        required: ['id'],
      },
    };
  }
}
