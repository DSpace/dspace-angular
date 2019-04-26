import { CacheableObject, TypedObject } from '../cache/object-cache.reducer';
import { GenericConstructor } from './generic-constructor';
import { ResourceType } from './resource-type';

const resourceTypeForObjectMap = new Map();

export function resourceType(...resourceType: ResourceType[]) {
  return function decorator(objectConstructor: GenericConstructor<TypedObject>) {
    if (!objectConstructor) {
      return;
    }
    resourceType.forEach((rt: string) => resourceTypeForObjectMap.set(rt, objectConstructor)
    )
  };
}

export function getNormalizedConstructorByType(resourceType: ResourceType) {
  return resourceTypeForObjectMap.get(resourceType);
}
