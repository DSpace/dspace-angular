import { hasNoValue, hasValue } from '../empty.util';
import { ElementViewMode } from '../view-mode';

export const DEFAULT_ENTITY_TYPE = 'Default';

const map = new Map();

/**
 * Decorator used for rendering simple item pages for an Entity by type and viewMode
 * @param type
 * @param viewMode
 */
export function rendersEntityType(type: string, viewMode: ElementViewMode) {
  return function decorator(component: any) {
    if (hasNoValue(map.get(viewMode))) {
      map.set(viewMode, new Map());
    }
    if (hasValue(map.get(viewMode).get(type))) {
      throw new Error(`There can't be more than one component to render Items of type "${type}" in view mode "${viewMode}"`);
    }
    map.get(viewMode).set(type, component);
  };
}

/**
 * Get the component used for rendering an entity by type and viewMode
 * @param type
 * @param viewMode
 */
export function getComponentByEntityType(type: string, viewMode: ElementViewMode) {
  let component = map.get(viewMode).get(type);
  if (hasNoValue(component)) {
    component = map.get(viewMode).get(DEFAULT_ENTITY_TYPE);
  }
  return component;
}
