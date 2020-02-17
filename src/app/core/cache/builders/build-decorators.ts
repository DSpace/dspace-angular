import 'reflect-metadata';
import { hasNoValue, hasValue } from '../../../shared/empty.util';
import { DataService } from '../../data/data.service';

import { GenericConstructor } from '../../shared/generic-constructor';
import { HALResource } from '../../shared/hal-resource.model';
import { ResourceType } from '../../shared/resource-type';
import { CacheableObject, TypedObject } from '../object-cache.reducer';

const resolvedLinkKey = Symbol('resolvedLink');

const resolvedLinkMap = new Map();
const typeMap = new Map();
const dataServiceMap = new Map();
const linkMap = new Map();

/**
 * Decorator function to map a ResourceType to its class
 * @param target The contructor of the typed class to map
 */
export function typedObject(target: typeof TypedObject) {
  typeMap.set(target.type.value, target);
}

/**
 * Returns the mapped class for the given type
 * @param type The resource type
 */
export function getClassForType(type: string | ResourceType) {
  if (typeof(type) === 'object') {
    type = (type as ResourceType).value;
  }
  return typeMap.get(type);
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

export const inheritLinkAnnotations = (parent: any): any => {
  return (child: any) => {
    const parentMap: Map<string, LinkDefinition<any>> = linkMap.get(parent) || new Map();
    const childMap: Map<string, LinkDefinition<any>> = linkMap.get(child) || new Map();

    parentMap.forEach((value, key) => {
      if (!childMap.has(key)) {
        childMap.set(key, value);
      }
    });

    linkMap.set(child, childMap);
  }
};
