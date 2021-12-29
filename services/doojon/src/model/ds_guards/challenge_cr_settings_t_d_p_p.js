import { DataserviceGuard } from '../ds_guard.js';

export default class ChallengeCrSettingsTDPPGuard extends DataserviceGuard {
  static get _tableName() {
    return 'ChallengeCrSettingsTDPP';
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
          maxTimes: { type: 'integer' },
          maxPeriodsNum: { type: ['integer', 'null'] },
          minPeriod: { type: 'integer' },
          challengeId: { type: 'string', maxLength: 11 },
          maxPeriod: { type: 'integer' },
          minTimes: { type: 'integer' },
          minPeriodsNum: { type: 'integer' },
        },
        required: [
          'maxTimes',
          'minPeriod',
          'challengeId',
          'maxPeriod',
          'minTimes',
          'minPeriodsNum',
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
      maxItems: 7,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: [
          'maxTimes',
          'maxPeriodsNum',
          'minPeriod',
          'challengeId',
          'maxPeriod',
          'minTimes',
          'minPeriodsNum',
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
          maxTimes: { type: 'integer' },
          maxPeriodsNum: { type: ['integer', 'null'] },
          minPeriod: { type: 'integer' },
          challengeId: { type: 'string', maxLength: 11 },
          maxPeriod: { type: 'integer' },
          minTimes: { type: 'integer' },
          minPeriodsNum: { type: 'integer' },
        },
        required: ['challengeId'],
      },
    };
  }
}
