import { Component } from '@angular/core';

import { RENDERS_BROWSE_BY_MAP } from '../../../decorator-registries/renders-browse-by-registry';
import { Context } from '../../core/shared/context.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { hasValue } from '../../shared/empty.util';
import {
  DEFAULT_THEME,
  getMatch,
} from '../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { BrowseByDataType } from './browse-by-data-type';

export const DEFAULT_BROWSE_BY_TYPE = BrowseByDataType.Metadata;
export const DEFAULT_BROWSE_BY_CONTEXT = Context.Any;

/**
 * Decorator used for rendering Browse-By pages by type
 * @param browseByType  The type of page
 * @param context The optional context for the component
 * @param theme The optional theme for the component
 */
export function rendersBrowseBy(browseByType: BrowseByDataType, context = DEFAULT_BROWSE_BY_CONTEXT, theme = DEFAULT_THEME) {
  return function decorator(component: any): void {
  };
}

/**
 * Get the component used for rendering a Browse-By page by type
 * @param browseByType  The type of page
 * @param context The context to match
 * @param theme the theme to match
 * @param registry The registry containing all the components
 */
export function getComponentByBrowseByType(browseByType: BrowseByDataType, context: Context, theme: string, registry = RENDERS_BROWSE_BY_MAP): Promise<GenericConstructor<Component>> {
  const match = getMatch(registry, [browseByType, context, theme], [DEFAULT_BROWSE_BY_TYPE, DEFAULT_BROWSE_BY_CONTEXT, DEFAULT_THEME]);
  return hasValue(match) ? match.match() : undefined;
}
