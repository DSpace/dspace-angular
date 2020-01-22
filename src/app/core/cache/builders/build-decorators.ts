import 'reflect-metadata';
import { hasNoValue, hasValue } from '../../../shared/empty.util';
import { DataService } from '../../data/data.service';
import { PaginatedList } from '../../data/paginated-list';

import { GenericConstructor } from '../../shared/generic-constructor';
import { HALResource } from '../../shared/hal-resource.model';
import { CacheableObject, TypedObject } from '../object-cache.reducer';
import { ResourceType } from '../../shared/resource-type';

const mapsToMetadataKey = Symbol('mapsTo');
const relationshipKey = Symbol('relationship');
const resolvedLinkKey = Symbol('resolvedLink');

const relationshipMap = new Map();
const resolvedLinkMap = new Map();
const typeMap = new Map();
const dataServiceMap = new Map();
const linkMap = new Map();

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

export function relationship<T extends CacheableObject>(value: GenericConstructor<T>, isList: boolean = false, shouldAutoResolve: boolean = true): any {
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
      isList,
      shouldAutoResolve
    }).apply(this, arguments);
  };
}

export function getRelationMetadata(target: any, propertyKey: string) {
  return Reflect.getMetadata(relationshipKey, target, propertyKey);
}

export function getRelationships(target: any) {
  return relationshipMap.get(target);
}

export function dataService(resourceType: ResourceType): any {
  return (target: any) => {
    if (hasNoValue(resourceType)) {
      throw new Error(`Invalid @dataService annotation on ${target}, resourceType needs to be defined`);
    }
    const existingDataservice = dataServiceMap.get(resourceType.value);

    if (hasValue(existingDataservice)) {
      throw new Error(`Multiple dataservices for ${resourceType.value}: ${existingDataservice} and ${target}`);
    }

    dataServiceMap.set(resourceType.value, target);
  };
}

export function getDataServiceFor<T extends CacheableObject>(resourceType: ResourceType) {
  return dataServiceMap.get(resourceType.value);
}

export function resolvedLink<T extends DataService<any>, K extends keyof T>(provider: GenericConstructor<T>, methodName?: K, ...params: any[]): any {
  return function r(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target || !propertyKey) {
      return;
    }

    const metaDataList: string[] = resolvedLinkMap.get(target.constructor) || [];
    if (metaDataList.indexOf(propertyKey) === -1) {
      metaDataList.push(propertyKey);
    }
    resolvedLinkMap.set(target.constructor, metaDataList);
    return Reflect.metadata(resolvedLinkKey, {
      provider,
      methodName,
      params
    }).apply(this, arguments);
  };
}

export function getResolvedLinkMetadata(target: any, propertyKey: string) {
  return Reflect.getMetadata(resolvedLinkKey, target, propertyKey);
}

export function getResolvedLinks(target: any) {
  return resolvedLinkMap.get(target);
}

export class LinkDefinition<T extends HALResource> {
  resourceType: ResourceType;
  isList = false;
  linkName: keyof T['_links'];
  propertyName: keyof T;
}

export const link = <T extends HALResource>(
  resourceType: ResourceType,
  isList = false,
  linkName?: keyof T['_links'],
  ) => {
  return (target: T, propertyName: string) => {
    let targetMap = linkMap.get(target.constructor);

    if (hasNoValue(targetMap)) {
      targetMap = new Map<keyof T['_links'],LinkDefinition<T>>();
    }

    if (hasNoValue(linkName)) {
      linkName = propertyName as any;
    }

    targetMap.set(propertyName, {
      resourceType,
      isList,
      linkName,
      propertyName
    });

    linkMap.set(target.constructor, targetMap);
  }
};

export const getLinkDefinitions = <T extends HALResource>(source: GenericConstructor<T>): Map<keyof T['_links'], LinkDefinition<T>> => {
  return linkMap.get(source);
};

export const getLinkDefinition = <T extends HALResource>(source: GenericConstructor<T>, linkName: keyof T['_links']): LinkDefinition<T> => {
  const sourceMap = linkMap.get(source);
  if (hasValue(sourceMap)) {
    return sourceMap.get(linkName);
  } else {
    return undefined;
  }
};
