import 'reflect-metadata';

import { GenericConstructor } from '../../shared/generic-constructor';
import { CacheableObject, TypedObject } from '../object-cache.reducer';
import { ResourceType } from '../../shared/resource-type';

const mapsToMetadataKey = Symbol('mapsTo');
const relationshipKey = Symbol('relationship');

const relationshipMap = new Map();
const typeMap = new Map();

/**
 * Decorator function to map a normalized class to it's not-normalized counter part class
 * It will also maps a type to the matching class
 * @param value The not-normalized class to map to
 */
export function mapsTo(value: GenericConstructor<TypedObject>) {
  return function decorator(objectConstructor: GenericConstructor<TypedObject>) {
    Reflect.defineMetadata(mapsToMetadataKey, value, objectConstructor);
    mapsToType((value as any).type, objectConstructor);
  }
}

/**
 * Maps a type to the matching class
 * @param value The resourse type
 * @param objectConstructor The class to map to
 */
function mapsToType(value: ResourceType, objectConstructor: GenericConstructor<TypedObject>) {
  if (!objectConstructor || !value) {
    return;
  }
  typeMap.set(value.value, objectConstructor);
}

/**
 * Returns the mapped class for the given normalized class
 * @param target The normalized class
 */
export function getMapsTo(target: any) {
  return Reflect.getOwnMetadata(mapsToMetadataKey, target);
}

/**
 * Returns the mapped class for the given type
 * @param type The resource type
 */
export function getMapsToType(type: string | ResourceType) {
  if (typeof(type) === 'object') {
    type = (type as ResourceType).value;
  }
  return typeMap.get(type);
}

export function relationship<T extends CacheableObject>(value: GenericConstructor<T>, isList: boolean = false): any {
  return function r(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target || !propertyKey) {
      return;
    }

    const metaDataList: string[] = relationshipMap.get(target.constructor) || [];
    if (metaDataList.indexOf(propertyKey) === -1) {
      metaDataList.push(propertyKey);
    }
    relationshipMap.set(target.constructor, metaDataList);
    return Reflect.metadata(relationshipKey, {
      resourceType: (value as any).type.value,
      isList
    }).apply(this, arguments);
  };
}

export function getRelationMetadata(target: any, propertyKey: string) {
  return Reflect.getMetadata(relationshipKey, target, propertyKey);
}

export function getRelationships(target: any) {
  return relationshipMap.get(target);
}
