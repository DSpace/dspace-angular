import { hasNoValue } from '../../shared/empty.util';
import { InjectionToken } from '@angular/core';
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

export enum BrowseByDataType {
  Title = 'title',
  Metadata = 'text',
  Date = 'date',
  Hierarchy = 'hierarchy'
}

export const DEFAULT_BROWSE_BY_TYPE = BrowseByDataType.Metadata;

export const BROWSE_BY_COMPONENT_FACTORY = new InjectionToken<(browseByType, theme) => GenericConstructor<any>>('getComponentByBrowseByType', {
  providedIn: 'root',
  factory: () => getComponentByBrowseByType
});

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
 * @param theme The optional theme for the component
 */
export function rendersBrowseBy(browseByType: BrowseByDataType, theme = DEFAULT_THEME) {
  return function decorator(component: any) {
    if (hasNoValue(BROWSE_BY_DECORATOR_MAP.get(browseByType))) {
      BROWSE_BY_DECORATOR_MAP.set(browseByType, new Map());
    }
    if (hasNoValue(BROWSE_BY_DECORATOR_MAP.get(browseByType).get(theme))) {
      BROWSE_BY_DECORATOR_MAP.get(browseByType).set(theme, component);
    } else {
      throw new Error(`There can't be more than one component to render Browse-By of type "${browseByType}" and theme "${theme}"`);
    }
  };
}

/**
 * Get the component used for rendering a Browse-By page by type
 * @param browseByType  The type of page
 * @param theme the theme to match
 */
export function getComponentByBrowseByType(browseByType, theme) {
  let themeMap = BROWSE_BY_DECORATOR_MAP.get(browseByType);
  if (hasNoValue(themeMap)) {
    themeMap = BROWSE_BY_DECORATOR_MAP.get(DEFAULT_BROWSE_BY_TYPE);
  }
  const comp = resolveTheme(themeMap, theme);
  if (hasNoValue(comp)) {
    return themeMap.get(DEFAULT_THEME);
  }
  return comp;
}
