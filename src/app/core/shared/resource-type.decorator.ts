import { CacheableObject } from '../cache/object-cache.reducer';
import { GenericConstructor } from './generic-constructor';

const resourceTypeForObjectMap = new Map();
export function resourceType(resourceType: string) {
  return function decorator(objectConstructor: GenericConstructor<CacheableObject>) {
    if (!objectConstructor) {
      return;
    }
    resourceTypeForObjectMap.set(resourceType, objectConstructor);
  };
}

export function rendersSectionType(resourceType: string) {
  return resourceTypeForObjectMap.get(resourceType);
}
