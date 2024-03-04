import { Component } from '@angular/core';
import { hasNoValue } from '../../shared/empty.util';
import { DEFAULT_THEME, resolveTheme } from '../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../core/shared/context.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import {
  DEFAULT_THEME,
  resolveTheme
} from '../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ThemedBrowseByDatePageComponent } from '../browse-by-date-page/themed-browse-by-date-page.component';
import {
  ThemedBrowseByMetadataPageComponent
} from '../browse-by-metadata-page/themed-browse-by-metadata-page.component';
import {
  ThemedBrowseByTaxonomyPageComponent
} from '../browse-by-taxonomy-page/themed-browse-by-taxonomy-page.component';
import { ThemedBrowseByTitlePageComponent } from '../browse-by-title-page/themed-browse-by-title-page.component';
import { BrowseByDataType } from './browse-by-data-type';
import { BrowseByDataType } from './browse-by-data-type';

export const DEFAULT_BROWSE_BY_TYPE = BrowseByDataType.Metadata;
export const DEFAULT_BROWSE_BY_CONTEXT = Context.Any;

export const BROWSE_BY_COMPONENT_FACTORY = new InjectionToken<(browseByType, theme) => GenericConstructor<any>>('getComponentByBrowseByType', {
  providedIn: 'root',
  factory: () => getComponentByBrowseByType
});

const map: Map<BrowseByDataType, Map<Context, Map<string, GenericConstructor<Component>>>> = new Map();

type BrowseByComponentType =
  typeof ThemedBrowseByTitlePageComponent |
  typeof ThemedBrowseByMetadataPageComponent |
  typeof ThemedBrowseByDatePageComponent |
  typeof ThemedBrowseByTaxonomyPageComponent;

export const BROWSE_BY_DECORATOR_MAP =
  new Map<BrowseByDataType, Map<string, BrowseByComponentType>>([
    [BrowseByDataType.Date, new Map([[DEFAULT_THEME, ThemedBrowseByDatePageComponent]])],
    [BrowseByDataType.Metadata, new Map([[DEFAULT_THEME, ThemedBrowseByMetadataPageComponent]])],
    [BrowseByDataType.Hierarchy, new Map([[DEFAULT_THEME, ThemedBrowseByTaxonomyPageComponent]])],
    [BrowseByDataType.Title, new Map([[DEFAULT_THEME, ThemedBrowseByTitlePageComponent]])]
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
export function getComponentByBrowseByType(browseByType: BrowseByDataType, context: Context, theme: string): GenericConstructor<Component> {
  let contextMap: Map<Context, Map<string, GenericConstructor<Component>>> = BROWSE_BY_DECORATOR_MAP.get(browseByType);
  if (hasNoValue(contextMap)) {
    contextMap = map.get(DEFAULT_BROWSE_BY_TYPE);
  }
  let themeMap: Map<string, GenericConstructor<Component>> = contextMap.get(context);
  if (hasNoValue(themeMap)) {
    themeMap = contextMap.get(DEFAULT_BROWSE_BY_CONTEXT);
  }
  const comp = resolveTheme(themeMap, theme);
  if (hasNoValue(comp)) {
    return themeMap.get(DEFAULT_THEME);
  }
  return comp;
}
