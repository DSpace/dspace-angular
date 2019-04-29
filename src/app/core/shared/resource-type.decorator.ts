import { TypedObject } from '../cache/object-cache.reducer';
import { GenericConstructor } from './generic-constructor';
import { ResourceType } from './resource-type';

const resourceTypeForObjectMap = new Map();

/**
 * Decorator function to map resource types to their matching normalized model class constructor
 * @param type The resource type used as a key in the map
 */
export function resourceType(...type: ResourceType[]) {
  return function decorator(objectConstructor: GenericConstructor<TypedObject>) {
    if (!objectConstructor) {
      return;
    }
    type.forEach((rt: string) => resourceTypeForObjectMap.set(rt, objectConstructor)
    )
  };
}

/**
 * Method to retrieve the normalized model class constructor based on a resource type
 * @param type The resource type to look for
 */
export function getNormalizedConstructorByType(type: ResourceType) {
  return resourceTypeForObjectMap.get(type);
}
