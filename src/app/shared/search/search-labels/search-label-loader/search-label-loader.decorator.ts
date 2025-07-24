import { Component } from '@angular/core';

import { RENDER_SEARCH_LABEL_FOR_MAP } from '../../../../../decorator-registries/render-search-label-for-registry';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { hasValue } from '../../../empty.util';
import {
  DEFAULT_THEME,
  getMatch,
} from '../../../object-collection/shared/listable-object/listable-object.decorator';

export const DEFAULT_LABEL_OPERATOR = '*';

export function renderSearchLabelFor(operator: string = DEFAULT_LABEL_OPERATOR, theme = DEFAULT_THEME) {
  return function decorator(objectElement: any) {
  };
}

export function getSearchLabelByOperator(operator: string, theme: string, registry: Map<string, () => Promise<any>> = RENDER_SEARCH_LABEL_FOR_MAP): Promise<GenericConstructor<Component>> {
  const match = getMatch(registry, [operator, theme], [DEFAULT_LABEL_OPERATOR, DEFAULT_THEME]);
  return hasValue(match) ? match.match() : undefined;
}
