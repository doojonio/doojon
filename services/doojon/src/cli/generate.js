import ejs from 'ejs';
import prettier from 'prettier';
import { camelCaseToSnakeCase } from '../string_util.js';
import nopt from 'nopt';

/**
 * @typedef {import('@mojojs/core').MojoApp} App
 */
/**
 *
 * @param {App} app
 * @param {Array} args
 */
export default async function run(app, args) {
  const options = _getOptions(args);
  /**
   * @type {import('@google-cloud/spanner').Database}
   */
  const db = app.model._container.resolve('/h/db');

  try {
    const [transaction] = await db.getSnapshot();

    const schema = await _getSchema(transaction);
    if (Object.keys(schema).length === 0) {
      console.log('No tables found. Did your run ddl statements?');
      process.exit(1);
    }

    await _generateDsEntities(app, schema, options);

    transaction.end();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  app.model.closeAllConnections();
}

function _getOptions(args) {
  const cliOptions = nopt(
    {
      'rw-ds': [String, Array],
      'rw-dsg': [String, Array],
      'rw-dss': [String, Array],
      'rw-all': [String, Array],
    },
    {},
    args,
    0
  );

  const options = {};
  if (cliOptions['rw-dsg']) {
    options.rewriteGuards = cliOptions['rw-dsg'];
  }
  if (cliOptions['rw-ds']) {
    options.rewriteDataservices = cliOptions['rw-ds'];
  }
  if (cliOptions['rw-dss']) {
    options.rewriteStewards = cliOptions['rw-dss'];
  }
  if (cliOptions['rw-all']) {
    for (const section of [
      'rewriteDataservices',
      'rewriteGuards',
      'rewriteStewards',
    ]) {
      options[section] = options[section] ?? [];
    }
    for (const name of cliOptions['rw-all']) {
      for (const section of [
        'rewriteDataservices',
        'rewriteGuards',
        'rewriteStewards',
      ]) {
        options[section].push(name);
      }
    }
  }

  return options;
}

function _getRowsUpdateSchemaCode(schema) {
  const properties = {};

  for (const [columnName, columnSchema] of Object.entries(schema.columns)) {
    if (['updated', 'created'].includes(columnName)) {
      continue;
    }

    const definition = { type: columnSchema.type };

    if (columnSchema.maxLength) {
      definition.maxLength = columnSchema.maxLength;
    }

    properties[columnName] = definition;
  }

  return JSON.stringify({
    type: 'array',
    minItems: 1,
    items: {
      type: 'object',
      minProperties: schema.keys.length + 1,
      additionalProperties: false,
      properties,
      required: schema.keys,
    },
  });
}

function _getColumnsReadSchemaCode(schema) {
  return JSON.stringify({
    type: 'array',
    minItems: 1,
    maxItems: Object.keys(schema.columns).length,
    uniqueItems: true,
    items: {
      type: 'string',
      enum: Object.keys(schema.columns),
    },
  });
}

function _getKeysSchemaCode(schema) {
  let keysTypes;
  if (schema.keys.length === 1) {
    keysTypes = schema.columns[schema.keys[0]].type;
  } else {
    keysTypes = [];
    for (const key of schema.keys) {
      keysTypes.push(schema.columns[key].type);
    }
  }

  return JSON.stringify({
    type: 'array',
    minItems: 1,
    items: {
      type: 'array',
      minItems: schema.keys.length,
      maxItems: schema.keys.length,
      description: schema.keys.toString(),
      items: {
        type: keysTypes,
      },
    },
  });
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

async function _generateDsSteward(app, namesAndSchema, options) {
  const file = app.home.child(
    'src',
    'model',
    'ds_stewards',
    namesAndSchema.fileName
  );

  if (
    (await file.exists()) &&
    !options.rewriteStewards?.includes(file.basename('.js'))
  ) {
    console.log(`Skipping ${file}`);
    return;
  }
  console.log(`Writing ${file}`);

  let dsStewardCode = ejs.render(DSSTEWARD_TEMPLATE, {
    className: namesAndSchema.className,
    tableName: namesAndSchema.tableName,
  });

  dsStewardCode = await _prettifyCode(app, dsStewardCode);

  await file.writeFile(dsStewardCode);
}

async function _generateDsGuard(app, namesAndSchema, options) {
  const file = app.home.child(
    'src',
    'model',
    'ds_guards',
    namesAndSchema.fileName
  );

  if (
    (await file.exists()) &&
    !options.rewriteGuards?.includes(file.basename('.js'))
  ) {
    console.log(`Skipping ${file}`);
    return;
  }
  console.log(`Writing ${file}`);

  const schema = namesAndSchema.schema;
  const objectsCreateSchemaCode = _getObjectsCreateSchemaCode(schema);
  const columnsReadSchemaCode = _getColumnsReadSchemaCode(schema);
  const rowsUpdateSchemaCode = _getRowsUpdateSchemaCode(schema);
  const keysSchemaCode = _getKeysSchemaCode(schema);

  let dsGuardCode = ejs.render(DSGUARD_TEMPLATE, {
    objectsCreateSchemaCode,
    columnsReadSchemaCode,
    rowsUpdateSchemaCode,
    keysSchemaCode,
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
async function _generateDs(app, names, options) {
  const file = app.home.child('src', 'model', 'dataservices', names.fileName);
  const moniker = file.basename('.js');

  if (
    (await file.exists()) &&
    !options.rewriteDataservices?.includes(moniker)
  ) {
    console.log(`Skipping ${file}`);
    return;
  }
  console.log(`Writing ${file}`);

  let dataserviceCode = ejs.render(DATASERVICE_TEMPLATE, {
    className: names.className,
    tableName: names.tableName,
    moniker,
  });
  dataserviceCode = await _prettifyCode(app, dataserviceCode);

  await file.writeFile(dataserviceCode);
}

async function _generateDsEntities(app, schema, options) {
  for (const tableName in schema) {
    let fileName = camelCaseToSnakeCase(tableName) + '.js';

    const dataserviceClassName = tableName + 'Dataservice';
    const guardClassName = tableName + 'Guard';
    const stewardClassName = tableName + 'Steward';
    _generateDs(
      app,
      { fileName, tableName, className: dataserviceClassName },
      options
    );
    _generateDsGuard(
      app,
      {
        fileName,
        tableName,
        className: guardClassName,
        schema: schema[tableName],
      },
      options
    );
    _generateDsSteward(
      app,
      {
        fileName,
        tableName,
        className: stewardClassName,
      },
      options
    );
  }

  let schemaString = JSON.stringify(schema);
  schemaString = await _prettifyCode(app, schemaString, true);

  await app.home.child('src', 'model', 'schema.json').writeFile(schemaString);
}

async function _prettifyCode(app, code, isJSON) {
  await prettier
    .resolveConfig(app.home.child('.prettierrc.json').toString())
    .then(options => {
      options.parser = isJSON ? 'json' : 'babel';
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

    const indexesQuery = {
      sql:
        'SELECT * FROM INFORMATION_SCHEMA.INDEXES ' +
        'WHERE TABLE_NAME = @table AND TABLE_SCHEMA = @schema ' +
        "AND SPANNER_IS_MANAGED = false AND INDEX_TYPE = 'INDEX'",
      params: {
        table: tableInfo.TABLE_NAME,
        schema: tableInfo.TABLE_SCHEMA,
      },
    };

    const [indexesRows] = await transaction.run(indexesQuery);
    const indexes = {};
    for (const indexRow of indexesRows) {
      const index = indexRow.toJSON();

      const indexColumnsQuery = {
        sql:
          'SELECT * FROM INFORMATION_SCHEMA.INDEX_COLUMNS ' +
          'WHERE TABLE_NAME = @table AND TABLE_SCHEMA = @schema ' +
          "AND INDEX_TYPE = 'INDEX' AND INDEX_NAME = @index " +
          'ORDER BY ORDINAL_POSITION',
        params: {
          table: tableInfo.TABLE_NAME,
          schema: tableInfo.TABLE_SCHEMA,
          index: index.INDEX_NAME,
        },
      };
      const [indexColumnsRows] = await transaction.run(indexColumnsQuery);
      const storing = [];
      const keys = [];
      for (const indexColumnRow of indexColumnsRows) {
        const indexColumn = indexColumnRow.toJSON();

        if (indexColumn.ORDINAL_POSITION === null) {
          storing.push(indexColumn.COLUMN_NAME);
        } else {
          keys.push(indexColumn.COLUMN_NAME);
        }
      }

      indexes[index.INDEX_NAME] = {
        keys,
        storing,
      };
    }

    const columnsQuery = {
      sql:
        'SELECT * FROM INFORMATION_SCHEMA.COLUMNS ' +
        'WHERE TABLE_NAME = @table AND TABLE_SCHEMA = @schema',
      params: {
        table: tableInfo.TABLE_NAME,
        schema: tableInfo.TABLE_SCHEMA,
      },
    };
    const [columnsRows] = await transaction.run(columnsQuery);

    const tableSchema = {
      columns: {},
      keys: [],
      indexes,
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

export default class <%=className%> extends DataserviceGuard {
  static get _tableName() {
    return '<%=tableName%>';
  }

  static get _objectsCreateSchema() {
    return <%- objectsCreateSchemaCode %>
  }

  static get _keysSchema() {
    return <%- keysSchemaCode %>
  }

  static get _columnsReadSchema() {
    return <%- columnsReadSchemaCode %>
  }

  static get _rowsUpdateSchema() {
    return <%- rowsUpdateSchemaCode %>
  }
}
`;

const DSSTEWARD_TEMPLATE = `
import { DataserviceSteward } from '../ds_steward.js';

export default class <%=className%> extends DataserviceSteward {
  static get _tableName() {
    return '<%=tableName%>'
  }
}
`;
