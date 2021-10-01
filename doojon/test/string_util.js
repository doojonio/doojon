import t from 'tap';
import { camelCaseToSnakeCase } from '../src/string_util.js';

t.test('camelCaseToSnakeCase', t => {
  const str1 = 'HelloWorld';
  const str2 = 'challengesRule';

  t.equal(camelCaseToSnakeCase(str1), 'hello_world');
  t.equal(camelCaseToSnakeCase(str2), 'challenges_rule');

  t.end();
});
