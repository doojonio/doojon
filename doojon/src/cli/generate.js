import ejs from 'ejs';
import prettier from 'prettier';
import { camelCaseToSnakeCase } from '../string_util.js';

/**
 * @typedef {import('@mojojs/core').MojoApp} App
 */
/**
 *
 * @param {App} app
 * @param {Array} args
 */
export default async function run(app, args) {
  /**
   * @type {import('@google-cloud/spanner').Database}
   */
  const db = app.model._container.resolve('/h/db');
  db.getSnapshot(async (err, transaction) => {
    if (err) {
      console.log('Unable to start read transaction: ' + err);
      process.exit(1);
    }

    const schema = await _getSchema(transaction);
    await _generateDsEntities(app, schema);
  });
}

function _getWhatUpdateSchemaCode(schema) {
  const properties = {};

  for (const [columnName, columnSchema] of Object.entries(schema.columns)) {
    if ([...schema.keys, 'updated', 'created'].includes(columnName)) {
      continue;
    }

    properties[columnName] = {type: columnSchema.type}
  }

  return JSON.stringify({
    type: 'object',
    minProperties: 1,
    additionalProperties: false,
    properties,
  })
}

function _getWhatReadSchemaCode(schema) {
  return JSON.stringify({
    type: 'array',
    minItems: 1,
    items: {
      type: 'string',
      enum: Object.keys(schema.columns)
    }
  })
}

function _getWhereSchemaCode(schema) {
  const properties = {};


  for (const key of schema.keys) {
    properties[key] = { type: schema.columns[key].type };
  }

  return JSON.stringify({
    type: 'object',
    additionalProperties: false,
    required: schema.keys,
    properties,
  })
}

function _getObjectsCreateSchemaCode(schema) {
  const properties = {};
  const required = [];
  for (const columnName in schema.columns) {
    if (['id', 'created', 'updated'].includes(columnName)) {
      continue;
    }

    const columnSchema = schema.columns[columnName];
    const type = columnSchema.type;

    const definition = { type };

    if (columnSchema.maxLength) {
      definition.maxLength = columnSchema.maxLength;
    }

    const isNullable = Array.isArray(type) && type.includes('null');

    if (!isNullable) {
      required.push(columnName);
    }

    properties[columnName] = definition;
  }

  return JSON.stringify({
    type: 'array',
    maxItems: 1,
    minItems: 1,
    items: {
      type: 'object',
      additionalProperties: false,
      properties,
      required,
    },
  });
}

async function _generateDsSteward(app, namesAndSchema) {
  const file = app.home.child(
    'src',
    'model',
    'ds_stewards',
    namesAndSchema.fileName
  );

  if (await file.exists()) {
    return;
  }

  let dsStewardCode = ejs.render(DSSTEWARD_TEMPLATE, {
    className: namesAndSchema.className,
    tableName: namesAndSchema.tableName,
  });

  dsStewardCode = await _prettifyCode(app, dsStewardCode);

  await file.writeFile(dsStewardCode);
}

async function _generateDsGuard(app, namesAndSchema) {
  const file = app.home.child(
    'src',
    'model',
    'ds_guards',
    namesAndSchema.fileName
  );

  if (await file.exists()) {
    return;
  }

  const schema = namesAndSchema.schema;
  const objectsCreateSchemaCode = _getObjectsCreateSchemaCode(schema);
  const whatReadSchemaCode = _getWhatReadSchemaCode(schema);
  const whatUpdateSchemaCode = _getWhatUpdateSchemaCode(schema);
  const whereSchemaCode = _getWhereSchemaCode(schema);

  let dsGuardCode = ejs.render(DSGUARD_TEMPLATE, {
    objectsCreateSchemaCode,
    whatReadSchemaCode,
    whatUpdateSchemaCode,
    whereSchemaCode,
    className: namesAndSchema.className,
    tableName: namesAndSchema.tableName,
  });

  dsGuardCode = await _prettifyCode(app, dsGuardCode);

  await file.writeFile(dsGuardCode);
}

/**
 *
 * @param {App} app
 * @param {Object} names
 * @returns
 */
async function _generateDs(app, names) {
  const file = app.home.child('src', 'model', 'dataservices', names.fileName);

  if (await file.exists()) {
    return;
  }

  const moniker = file.basename('.js');

  let dataserviceCode = ejs.render(DATASERVICE_TEMPLATE, {
    className: names.className,
    tableName: names.tableName,
    moniker,
  });
  dataserviceCode = await _prettifyCode(app, dataserviceCode);

  await file.writeFile(dataserviceCode);
}

async function _generateDsEntities(app, schema) {
  for (const tableName in schema) {
    let fileName = camelCaseToSnakeCase(tableName) + '.js';

    const dataserviceClassName = tableName + 'Dataservice';
    const guardClassName = tableName + 'Guard';
    const stewardClassName = tableName + 'Steward';
    _generateDs(app, { fileName, tableName, className: dataserviceClassName });
    _generateDsGuard(app, {
      fileName,
      tableName,
      className: guardClassName,
      schema: schema[tableName],
    });
    _generateDsSteward(app, {
      fileName,
      tableName,
      className: stewardClassName,
    })
  }

  let schemaString = JSON.stringify(schema);
  schemaString = await _prettifyCode(app, schemaString, true);

  await app.home.child('src', 'model', 'schema.json').writeFile(schemaString);
}

async function _prettifyCode(app, code, isJSON) {
  await prettier
    .resolveConfig(app.home.child('.prettierrc.json').toString())
    .then(options => {
      options.parser = isJSON ? 'json': 'babel';
      code = prettier.format(code, options);
    });

  return code;
}

/**
 *
 * @param {string} spannerType
 */
function _getTypeInfo(spannerType) {
  let match = spannerType.match(/(\w+)\((\d+)\)/);
  if (match) {
    return [match[1].toLowerCase(), +match[2]];
  }

  if (spannerType == 'INT64') {
    return ['integer'];
  }

  if (spannerType == 'BOOL') {
    return ['boolean'];
  }

  if (spannerType == 'TIMESTAMP') {
    return ['string'];
  }

  if (spannerType == 'DATE') {
    return ['string'];
  }

  return [spannerType.toLowerCase()];
}

async function _getSchema(transaction) {
  const schema = {};
  const [tablesRows] = await transaction.run(
    `SELECT * FROM INFORMATION_SCHEMA.TABLES ` +
      `WHERE TABLE_SCHEMA != 'INFORMATION_SCHEMA'`
  );
  for (let row of tablesRows) {
    const tableInfo = row.toJSON();

    let columnsQuery = {
      sql:
        `SELECT * FROM INFORMATION_SCHEMA.COLUMNS ` +
        `WHERE TABLE_NAME = @table AND TABLE_SCHEMA = @schema`,
      params: {
        table: tableInfo.TABLE_NAME,
        schema: tableInfo.TABLE_SCHEMA,
      },
    };
    const [columnsRows] = await transaction.run(columnsQuery);

    const tableSchema = {
      columns: {},
      keys: [],
    };
    for (let colRow of columnsRows) {
      const column = colRow.toJSON();

      const spannerType = column.SPANNER_TYPE;
      const [type, maxLength] = _getTypeInfo(spannerType);

      const columnSchema = {
        spannerType,
        type,
      };

      if (maxLength) {
        columnSchema.maxLength = maxLength;
      }

      const constraintQuery = {
        sql:
          `SELECT CONSTRAINT_TYPE, CONSTRAINT_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS ` +
          `WHERE CONSTRAINT_NAME IN ( ` +
          `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ` +
          `WHERE COLUMN_NAME = @column AND TABLE_NAME = @table AND ` +
          `TABLE_SCHEMA = @schema ` +
          `) ` +
          `AND CONSTRAINT_TYPE IN ('PRIMARY KEY', 'CHECK')`,
        params: {
          column: column.COLUMN_NAME,
          table: tableInfo.TABLE_NAME,
          schema: tableInfo.TABLE_SCHEMA,
        },
      };

      let isNullable = true;

      const [constraintRows] = await transaction.run(constraintQuery);
      for (const constraintRow of constraintRows) {
        const constraint = constraintRow.toJSON();

        if (constraint.CONSTRAINT_TYPE == 'PRIMARY KEY') {
          tableSchema.keys.push(column.COLUMN_NAME);
        }

        if (constraint.CONSTRAINT_NAME.match(/CK_IS_NOT_NULL_/)) {
          isNullable = false;
        }
      }

      if (isNullable) {
        columnSchema.type = [columnSchema.type, 'null'];
      }

      tableSchema.columns[column.COLUMN_NAME] = columnSchema;
    }

    schema[tableInfo.TABLE_NAME] = tableSchema;
  }

  return schema;
}

const DATASERVICE_TEMPLATE = `
import { Dataservice } from '../dataservice.js';

export default class <%=className%> extends Dataservice {
  static get _tableName() {
    return '<%=tableName%>'
  }

  static get _moniker() {
    return '<%=moniker%>'
  }
}

`;

const DSGUARD_TEMPLATE = `
import { DataserviceGuard } from '../ds_guard.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class <%=className%> extends DataserviceGuard {
  static get _tableName() {
    return '<%=tableName%>';
  }

  static get _objectsCreateSchema() {
    return <%- objectsCreateSchemaCode %>
  }

  static get _whereReadSchema() {
    return <%- whereSchemaCode %>
  }

  static get _whatReadSchema() {
    return <%- whatReadSchemaCode %>
  }

  static get _whereUpdateSchema() {
    return <%- whereSchemaCode %>
  }

  static get _whatUpdateSchema() {
    return <%- whatUpdateSchemaCode %>
  }

  static get _whereDeleteSchema() {
    return <%- whereSchemaCode %>
  }

  /**
   * - User has to be authorized
   *
   * @param {State} state
   * @param {Array<Object>} objects
   */
  _preCreateAdditionalChecks(state, objects) {
    this.isAuthorized(state);
  }
}
`;

const DSSTEWARD_TEMPLATE = `
import { DataserviceSteward } from '../ds_steward.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class <%=className%> extends DataserviceSteward {
  static get _tableName() {
    return '<%=tableName%>'
  }

  preCreateAction(state, objects) {
  }
}
`;