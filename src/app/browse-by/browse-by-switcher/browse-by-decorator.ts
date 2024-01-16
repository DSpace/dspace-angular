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
  Date = 'date'
}

export const DEFAULT_BROWSE_BY_TYPE = BrowseByDataType.Metadata;

export const BROWSE_BY_COMPONENT_FACTORY = new InjectionToken<(browseByType, theme) => GenericConstructor<any>>('getComponentByBrowseByType', {
  providedIn: 'root',
  factory: () => getComponentByBrowseByType
});

const map = new Map();
map.set(BrowseByDataType.Date, new Map());
map.get(BrowseByDataType.Date).set(DEFAULT_THEME, ThemedBrowseByDatePageComponent);
map.set(BrowseByDataType.Metadata, new Map());
map.get(BrowseByDataType.Metadata).set(DEFAULT_THEME, ThemedBrowseByMetadataPageComponent);
map.set('hierarchy', new Map());
map.get('hierarchy').set(DEFAULT_THEME, ThemedBrowseByTaxonomyPageComponent);
map.set(BrowseByDataType.Title, new Map());
map.get(BrowseByDataType.Title).set(DEFAULT_THEME, ThemedBrowseByTitlePageComponent);

/**
 * Decorator used for rendering Browse-By pages by type
 * @param browseByType  The type of page
 * @param theme The optional theme for the component
 */
export function rendersBrowseBy(browseByType: string, theme = DEFAULT_THEME) {
  return function decorator(component: any) {
    if (hasNoValue(map.get(browseByType))) {
      map.set(browseByType, new Map());
    }
    if (hasNoValue(map.get(browseByType).get(theme))) {
      map.get(browseByType).set(theme, component);
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
  let themeMap = map.get(browseByType);
  if (hasNoValue(themeMap)) {
    themeMap = map.get(DEFAULT_BROWSE_BY_TYPE);
  }
  const comp = resolveTheme(themeMap, theme);
  if (hasNoValue(comp)) {
    return themeMap.get(DEFAULT_THEME);
  }
  return comp;
}
