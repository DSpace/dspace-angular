import {
  Component,
  Type,
} from '@angular/core';

import { hasNoValue } from '../../../empty.util';
import { DEFAULT_THEME } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { SearchLabelComponent } from '../search-label/search-label.component';
import { SearchLabelRangeComponent } from '../search-label-range/search-label-range.component';

export const DEFAULT_LABEL_OPERATOR = undefined;

export const LABEL_DECORATOR_MAP: Map<string, Map<string, Type<Component>>> = new Map([
  [DEFAULT_LABEL_OPERATOR, new Map([
    [DEFAULT_THEME, SearchLabelComponent as Type<Component>],
  ])],
  ['range', new Map([
    [DEFAULT_THEME, SearchLabelRangeComponent as Type<Component>],
  ])],
]);

export function getSearchLabelByOperator(operator: string, theme: string): Type<Component> {
  let themeMap: Map<string, Type<Component>> = LABEL_DECORATOR_MAP.get(operator);
  if (hasNoValue(themeMap)) {
    themeMap = LABEL_DECORATOR_MAP.get(DEFAULT_LABEL_OPERATOR);
  }
  const comp: Type<Component> = themeMap.get(theme);
  if (hasNoValue(comp)) {
    return themeMap.get(DEFAULT_THEME);
  }
  return comp;
}
