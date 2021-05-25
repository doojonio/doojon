const SUBCOMMANDS = {
  generate: cliGenerate,
};

const NOT_DS_TABLES = ["knex_migrations", "knex_migrations_lock"];

export default async function run(app, args) {
  const subcommand = SUBCOMMANDS[args[1]];

  if (!subcommand) {
    throw new Error("No such subcommand");
  }

  await subcommand.call(this, app);
}

async function cliGenerate(app) {
  const db = app.model._container.resolve("/h/db");

  let tables = await db
    .select("table_name")
    .from("information_schema.tables")
    .where({ table_schema: "public" });
  tables = tables.map((t) => t["table_name"]);

  for (let table of tables) {
    if (NOT_DS_TABLES.includes(table)) continue;

    const columns = await db
      .select()
      .from("information_schema.columns")
      .where({ table_name: table, table_schema: "public" });

    for (const col of columns) {
      col["data_type"] = _translate_data_type(col["data_type"]);
    }

    const primaryKeys = await _getPrimaryKeys(db, table);

    console.log(primaryKeys);
  }

  db.destroy();
}

function _translate_data_type(type) {
  if (type === "boolean" || type === "date") {
    return type;
  } else if (/character|text|uuid/.test(type)) {
    return "string";
  } else if (/bigint|integer|smallint/.test(type)) {
    return "integer";
  } else if (/double|numeric|real/.test(type)) {
    return "number";
  } else if (/timestamp/.test(type)) {
    return "timestamp";
  } else if (/time/.test(type)) {
    return "time";
  }

  throw new Error(`Unable to translate type ${type}`);
}

async function _getPrimaryKeys(db, table) {
  return db
    .select("c.column_name")
    .from("information_schema.table_constraints as tc")
    .join({ ccu: "information_schema.constraint_column_usage" }, function () {
      this.on("ccu.constraint_schema", "=", "tc.constraint_schema").andOn(
        "ccu.constraint_name",
        "=",
        "tc.constraint_name"
      );
    })
    .join({ c: "information_schema.columns" }, function () {
      this.on("c.table_schema", "=", "tc.constraint_schema")
        .andOn("tc.table_name", "=", "c.table_name")
        .andOn("ccu.column_name", "=", "c.column_name");
    })
    .where({ constraint_type: "PRIMARY KEY", "tc.table_name": table });
}
