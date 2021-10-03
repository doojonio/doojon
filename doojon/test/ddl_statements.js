import { File } from '@mojojs/core';
import t from 'tap';

t.test('They export DDL_STATEMENTS', async t => {
  const ddlStatementsDir = File.currentFile().relative(
    '..',
    'src',
    'ddl_statements'
  );

  for await (const jsFile of ddlStatementsDir.list()) {
    const statements = (await import(jsFile.toString())).DDL_STATEMENTS;
    t.ok(statements, 'Statments exported');
    t.ok(Array.isArray(statements), 'Statements is array');

    for (const statement of statements) {
      t.ok(
        typeof statement === 'string',
        `Every statement of file ${jsFile.toString()} is string`
      );
    }
  }
});
