import {
  Component,
  Type,
} from '@angular/core';

import { hasNoValue } from '../../../empty.util';
import { SearchLabelComponent } from '../search-label/search-label.component';
import { SearchLabelRangeComponent } from '../search-label-range/search-label-range.component';

export const DEFAULT_LABEL_OPERATOR = undefined;

export const LABEL_DECORATOR_MAP: Map<string, Type<Component>> = new Map([
  [DEFAULT_LABEL_OPERATOR, SearchLabelComponent as Type<Component>],
  ['range', SearchLabelRangeComponent as Type<Component>],
]);

export function getSearchLabelByOperator(operator: string): Type<Component> {
  const comp: Type<Component> = LABEL_DECORATOR_MAP.get(operator);
  if (hasNoValue(comp)) {
    return LABEL_DECORATOR_MAP.get(DEFAULT_LABEL_OPERATOR);
  }
  return comp;
}
