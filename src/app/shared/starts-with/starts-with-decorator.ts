import { Component } from '@angular/core';

import { RENDER_STARTS_WITH_FOR_MAP } from '../../../decorator-registries/render-starts-with-for-registry';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { hasValue } from '../empty.util';
import {
  DEFAULT_THEME,
  getMatch,
} from '../object-collection/shared/listable-object/listable-object.decorator';
import { StartsWithType } from './starts-with-type';

export const DEFAULT_STARTS_WITH_TYPE = StartsWithType.text;

/**
 * Fetch a decorator to render a StartsWith component for type
 * @param type
 */
export function renderStartsWithFor(type: StartsWithType = DEFAULT_STARTS_WITH_TYPE) {
  return function decorator(objectElement: any) {
  };
}

/**
 * Get the correct component depending on the StartsWith type
 * @param type the {@link StartsWithType} to match
 * @param theme the theme to match
 * @param registry The registry containing all the components
 */
export function getStartsWithComponent(type: StartsWithType, theme: string, registry = RENDER_STARTS_WITH_FOR_MAP): Promise<GenericConstructor<Component>> {
  const match = getMatch(registry, [type, theme], [DEFAULT_STARTS_WITH_TYPE, DEFAULT_THEME]);
  return hasValue(match) ? match.match() : undefined;
}
