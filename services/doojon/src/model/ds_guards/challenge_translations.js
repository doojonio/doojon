import { DataserviceGuard } from '../ds_guard.js';

export default class ChallengeTranslationsGuard extends DataserviceGuard {
  static get _tableName() {
    return 'ChallengeTranslations';
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
          title: { type: 'string', maxLength: 100 },
          languageCode: { type: 'string', maxLength: 13 },
          criteriumSpecific: {},
          challengeId: { type: 'string', maxLength: 11 },
          description: { type: 'string', maxLength: 10000 },
          tag: { type: 'string', maxLength: 50 },
        },
        required: [
          'title',
          'languageCode',
          'challengeId',
          'description',
          'tag',
        ],
      },
    };
  }

  static get _keysSchema() {
    return {
      type: 'array',
      minItems: 1,
      items: {
        type: 'array',
        minItems: 2,
        maxItems: 2,
        description: 'languageCode,challengeId',
        items: { type: ['string'] },
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
          'title',
          'languageCode',
          'criteriumSpecific',
          'challengeId',
          'description',
          'tag',
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
        minProperties: 3,
        additionalProperties: false,
        properties: {
          title: { type: 'string', maxLength: 100 },
          languageCode: { type: 'string', maxLength: 13 },
          criteriumSpecific: {},
          challengeId: { type: 'string', maxLength: 11 },
          description: { type: 'string', maxLength: 10000 },
          tag: { type: 'string', maxLength: 50 },
        },
        required: ['languageCode', 'challengeId'],
      },
    };
  }
}
