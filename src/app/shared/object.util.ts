/**
 * Returns passed object without specified property
 */
export function deleteProperty(object, key): object {
  const {[key]: deletedKey, ...otherKeys} = object;
  return otherKeys;
}
