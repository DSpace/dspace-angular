import { Component, Type } from '@angular/core';
import { DEFAULT_THEME } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { hasNoValue } from '../../../empty.util';

export const DEFAULT_LABEL_OPERATOR = undefined;

const map: Map<string, Map<string, Type<Component>>> = new Map();

export function renderSearchLabelFor(operator: string = DEFAULT_LABEL_OPERATOR, theme = DEFAULT_THEME) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    if (hasNoValue(map.get(operator))) {
      map.set(operator, new Map());
    }
    if (hasNoValue(map.get(operator).get(theme))) {
      map.get(operator).set(theme, objectElement);
    } else {
      throw new Error(`There can't be more than one component to render Label with operator "${operator}" and theme "${theme}"`);
    }
  };
}

export function getSearchLabelByOperator(operator: string, theme: string): Type<Component> {
  let themeMap: Map<string, Type<Component>> = map.get(operator);
  if (hasNoValue(themeMap)) {
    themeMap = map.get(DEFAULT_LABEL_OPERATOR);
  }
  const comp: Type<Component> = themeMap.get(theme);
  if (hasNoValue(comp)) {
    return themeMap.get(DEFAULT_THEME);
  }
  return comp;
}
