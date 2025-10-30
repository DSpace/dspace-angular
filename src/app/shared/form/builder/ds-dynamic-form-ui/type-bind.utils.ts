import {
  DynamicFormControlRelation,
  MATCH_ENABLED,
  MATCH_VISIBLE,
  OR_OPERATOR,
} from '@ng-dynamic-forms/core';

/**
 * Get the type bind values from the REST data for a specific field
 * The return value is any[] in the method signature but in reality it's
 * returning the 'relation' that'll be used for a dynamic matcher when filtering
 * fields in type bind, made up of a 'match' outcome (make this field visible), an 'operator'
 * (OR) and a 'when' condition (the bindValues array).
 * @param configuredTypeBindValues  array of types from the submission definition (CONFIG_DATA)
 * @param typeField
 * @private
 * @return DynamicFormControlRelation[] array with one relation in it, for type bind matching to show a field
 */
export function getTypeBindRelations(configuredTypeBindValues: string[], typeField: string): DynamicFormControlRelation[] {
  const bindValues = [];
  configuredTypeBindValues.forEach((value) => {
    bindValues.push({
      id: typeField,
      value: value,
    });
  });
  // match: MATCH_VISIBLE means that if true, the field / component will be visible
  // operator: OR means that all the values in the 'when' condition will be compared with OR, not AND
  // when: the list of values to match against, in this case the list of strings from <type-bind>...</type-bind>
  // Example: Field [x] will be VISIBLE if item type = book OR item type = book_part
  //
  // The opposing match value will be the dc.type for the workspace item
  //
  // MATCH_ENABLED is now also returned, so that hidden type-bound fields that are 'required'
  // do not trigger false validation errors
  return [
    {
      match: MATCH_ENABLED,
      operator: OR_OPERATOR,
      when: bindValues,
    },
    {
      match: MATCH_VISIBLE,
      operator: OR_OPERATOR,
      when: bindValues,
    },
  ];
}
