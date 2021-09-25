import ejs from 'ejs';
import { File } from '@mojojs/core';
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
    }

    const schema = await _getSchema(transaction);
    await _generateDsEntities(app, schema);
  });
}

function _getWhereReadSchemaCode(schema) {

  return {
    type: 'object',
  }
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

  const objectsCreateSchemaCode = _getObjectsCreateSchemaCode(namesAndSchema.schema);

  let dsGuardCode = ejs.render(DSGUARD_TEMPLATE, {
    createSchemaCode: objectsCreateSchemaCode,
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
    _generateDs(app, { fileName, tableName, className: dataserviceClassName });
    _generateDsGuard(app, {
      fileName,
      tableName,
      className: guardClassName,
      schema: schema[tableName],
    });
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
  static get _tablename() {
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
  static get _createSchema() {
    return <%- createSchemaCode %>
  }

  /**
   * - User has to be authorized
   *
   * @param {State} state
   * @param {Array<Object>} objects
   */
  precreateCheck(state, objects) {
    this.isAuthorized(state);
  }
}
`;
