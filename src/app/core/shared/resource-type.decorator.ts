import { CacheableObject } from '../cache/object-cache.reducer';
import { GenericConstructor } from './generic-constructor';

const resourceTypeForObjectMap = new Map();

export function resourceType(...resourceType: string[]) {
  return function decorator(objectConstructor: GenericConstructor<CacheableObject>) {
    if (!objectConstructor) {
      return;
    }
    resourceType.forEach((rt: string) => resourceTypeForObjectMap.set(rt, objectConstructor)
    )
  };
}

export function getNormalizedConstructorByType(resourceType: string) {
  return resourceTypeForObjectMap.get(resourceType);
}
