import 'reflect-metadata';

import { GenericConstructor } from '../../shared/generic-constructor';
import { CacheableObject } from '../object-cache.reducer';
import { ResourceType } from '../../shared/resource-type';

const mapsToMetadataKey = Symbol('mapsTo');
const relationshipKey = Symbol('relationship');

const relationshipMap = new Map();

export function mapsTo(value: GenericConstructor<CacheableObject>) {
  return Reflect.metadata(mapsToMetadataKey, value);
}

export function getMapsTo(target: any) {
  return Reflect.getOwnMetadata(mapsToMetadataKey, target);
}

export function relationship(value: ResourceType, isList: boolean = false): any {
  return function r(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target || !propertyKey) {
      return;
    }

    const metaDataList: string[] = relationshipMap.get(target.constructor) || [];
    if (metaDataList.indexOf(propertyKey) === -1) {
      metaDataList.push(propertyKey);
    }
    relationshipMap.set(target.constructor, metaDataList);

    return Reflect.metadata(relationshipKey, { resourceType: value, isList }).apply(this, arguments);
  };
}

export function getRelationMetadata(target: any, propertyKey: string) {
  return Reflect.getMetadata(relationshipKey, target, propertyKey);
}

export function getRelationships(target: any) {
  return relationshipMap.get(target);
}
