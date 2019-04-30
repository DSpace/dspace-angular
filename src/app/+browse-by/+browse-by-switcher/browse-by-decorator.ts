import { hasNoValue } from '../../shared/empty.util';

export enum BrowseByType {
  Title = 'title',
  Metadata = 'metadata',
  Date = 'date'
}

export const DEFAULT_BROWSE_BY_TYPE = BrowseByType.Metadata;

const map = new Map();

export function rendersBrowseBy(browseByType: BrowseByType) {
  return function decorator(component: any) {
    if (hasNoValue(map.get(browseByType))) {
      map.set(browseByType, component);
    } else {
      throw new Error(`There can't be more than one component to render Browse-By of type "${browseByType}"`);
    }
  };
}

export function getComponentByBrowseByType(browseByType) {
  const comp = map.get(browseByType);
  if (hasNoValue(comp)) {
    map.get(DEFAULT_BROWSE_BY_TYPE);
  }
  return comp;
}
