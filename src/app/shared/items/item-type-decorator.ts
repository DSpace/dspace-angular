import { hasNoValue, hasValue } from '../empty.util';
import { ViewMode } from '../../core/shared/view-mode.model';

export const DEFAULT_ITEM_TYPE = 'Default';
export const DEFAULT_VIEW_MODE = ViewMode.ListElement;


const map = new Map();

/**
 * Decorator used for rendering simple item pages by type and viewMode (and optionally a representationType)
 * @param type
 * @param viewMode
 */
export function rendersItemType(type: string, viewMode: string) {
  return function decorator(component: any) {
    if (hasNoValue(map.get(viewMode))) {
      map.set(viewMode, new Map());
    }
    if (hasValue(map.get(viewMode).get(type))) {
      throw new Error(`There can't be more than one component to render Metadata of type "${type}" in view mode "${viewMode}"`);
    }
    map.get(viewMode).set(type, component);
  };
}

/**
 * Get the component used for rendering an item by type and viewMode (and optionally a representationType)
 * @param type
 * @param viewMode
 */
export function getComponentByItemType(type: string, viewMode: string) {
  if (hasNoValue(map.get(viewMode))) {
    viewMode = DEFAULT_VIEW_MODE;
  }
  if (hasNoValue(map.get(viewMode).get(type))) {
    type = DEFAULT_ITEM_TYPE;
  }
  return map.get(viewMode).get(type);
}
