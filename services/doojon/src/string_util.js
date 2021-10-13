/**
 * CamelCase -> snake_case
 *
 * @param {string} str
 */
export function camelCaseToSnakeCase(str) {
  str = str[0].toLowerCase() + str.slice(1);
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}
