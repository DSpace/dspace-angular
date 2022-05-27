import { hasNoValue } from '../../shared/empty.util';
import { InjectionToken } from '@angular/core';
import { GenericConstructor } from '../../core/shared/generic-constructor';

export enum BrowseByDataType {
  Title = 'title',
  Metadata = 'text',
  Date = 'date'
}

export const DEFAULT_BROWSE_BY_TYPE = BrowseByDataType.Metadata;

export const BROWSE_BY_COMPONENT_FACTORY = new InjectionToken<(browseByType) => GenericConstructor<any>>('getComponentByBrowseByType', {
  providedIn: 'root',
  factory: () => getComponentByBrowseByType
});

const map = new Map();

/**
 * Decorator used for rendering Browse-By pages by type
 * @param browseByType  The type of page
 */
export function rendersBrowseBy(browseByType: BrowseByDataType) {
  return function decorator(component: any) {
    if (hasNoValue(map.get(browseByType))) {
      map.set(browseByType, component);
    } else {
      throw new Error(`There can't be more than one component to render Browse-By of type "${browseByType}"`);
    }
  };
}

/**
 * Get the component used for rendering a Browse-By page by type
 * @param browseByType  The type of page
 */
export function getComponentByBrowseByType(browseByType) {
  const comp = map.get(browseByType);
  if (hasNoValue(comp)) {
    map.get(DEFAULT_BROWSE_BY_TYPE);
  }
  return comp;
}
