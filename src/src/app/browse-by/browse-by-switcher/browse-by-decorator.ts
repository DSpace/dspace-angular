import { Component } from '@angular/core';

import { Context } from '../../core/shared/context.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { hasNoValue } from '../../shared/empty.util';
import {
  DEFAULT_THEME,
  resolveTheme,
} from '../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { BrowseByDateComponent } from '../browse-by-date/browse-by-date.component';
import { BrowseByMetadataComponent } from '../browse-by-metadata/browse-by-metadata.component';
import { BrowseByTaxonomyComponent } from '../browse-by-taxonomy/browse-by-taxonomy.component';
import { BrowseByTitleComponent } from '../browse-by-title/browse-by-title.component';
import { BrowseByDataType } from './browse-by-data-type';

export const DEFAULT_BROWSE_BY_TYPE = BrowseByDataType.Metadata;
export const DEFAULT_BROWSE_BY_CONTEXT = Context.Any;

const map: Map<BrowseByDataType, Map<Context, Map<string, GenericConstructor<Component>>>> = new Map();

type BrowseByComponentType =
  typeof BrowseByTitleComponent |
  typeof BrowseByMetadataComponent |
  typeof BrowseByDateComponent |
  typeof BrowseByTaxonomyComponent;

export const BROWSE_BY_DECORATOR_MAP =
  new Map<BrowseByDataType, Map<Context, Map<string, BrowseByComponentType>>>([
    [BrowseByDataType.Date, new Map([[DEFAULT_BROWSE_BY_CONTEXT, new Map([[DEFAULT_THEME, BrowseByDateComponent]])]])],
    [BrowseByDataType.Metadata, new Map([[DEFAULT_BROWSE_BY_CONTEXT, new Map([[DEFAULT_THEME, BrowseByMetadataComponent]])]])],
    [BrowseByDataType.Hierarchy, new Map([[DEFAULT_BROWSE_BY_CONTEXT, new Map([[DEFAULT_THEME, BrowseByTaxonomyComponent]])]])],
    [BrowseByDataType.Title, new Map([[DEFAULT_BROWSE_BY_CONTEXT, new Map([[DEFAULT_THEME, BrowseByTitleComponent]])]])],
  ]);

/**
 * Decorator used for rendering Browse-By pages by type
 * @param browseByType  The type of page
 * @param context The optional context for the component
 * @param theme The optional theme for the component
 * @deprecated Standalone components are not compatible with this decorator. Use the BROWSE_BY_DECORATOR_MAP instead.
 */
export function rendersBrowseBy(browseByType: BrowseByDataType, context = DEFAULT_BROWSE_BY_CONTEXT, theme = DEFAULT_THEME) {
  return function decorator(component: any) {
    if (hasNoValue(browseByType)) {
      return;
    }
    if (hasNoValue(BROWSE_BY_DECORATOR_MAP.get(browseByType))) {
      BROWSE_BY_DECORATOR_MAP.set(browseByType, new Map());
    }
    if (hasNoValue(BROWSE_BY_DECORATOR_MAP.get(browseByType).get(context))) {
      map.get(browseByType).set(context, new Map());
    }
    if (hasNoValue(map.get(browseByType).get(context).get(theme))) {
      BROWSE_BY_DECORATOR_MAP.get(browseByType).get(context).set(theme, component);
    } else {
      throw new Error(`There can't be more than one component to render Browse-By of type "${browseByType}", context "${context}" and theme "${theme}"`);
    }
  };
}

/**
 * Get the component used for rendering a Browse-By page by type
 * @param browseByType  The type of page
 * @param context The context to match
 * @param theme the theme to match
 */
export function getComponentByBrowseByType(browseByType: BrowseByDataType, context: Context, theme: string) {
  let contextMap: Map<Context, Map<string, BrowseByComponentType>> = BROWSE_BY_DECORATOR_MAP.get(browseByType);
  if (hasNoValue(contextMap)) {
    contextMap = BROWSE_BY_DECORATOR_MAP.get(DEFAULT_BROWSE_BY_TYPE);
  }
  let themeMap: Map<string, BrowseByComponentType> = contextMap.get(context);
  if (hasNoValue(themeMap)) {
    themeMap = contextMap.get(DEFAULT_BROWSE_BY_CONTEXT);
  }
  const comp = resolveTheme(themeMap, theme);
  if (hasNoValue(comp)) {
    return themeMap.get(DEFAULT_THEME);
  }
  return comp;
}
