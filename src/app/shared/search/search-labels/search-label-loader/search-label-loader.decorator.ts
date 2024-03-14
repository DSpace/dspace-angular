import { Component } from '@angular/core';

import { GenericConstructor } from '../../../../core/shared/generic-constructor';

export const map: Map<string, GenericConstructor<Component>> = new Map();

export function renderSearchLabelFor(operator: string) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    map.set(operator, objectElement);
  };
}

export function getSearchLabelByOperator(operator: string): GenericConstructor<Component> {
  return map.get(operator);
}
