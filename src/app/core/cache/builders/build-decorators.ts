import { InjectionToken } from '@angular/core';

import {
  hasNoValue,
  hasValue,
} from '../../../shared/empty.util';
import { GenericConstructor } from '../../shared/generic-constructor';
import { HALResource } from '../../shared/hal-resource.model';
import { ResourceType } from '../../shared/resource-type';
import { CacheableObject } from '../cacheable-object.model';
import { getResourceTypeValueFor } from '../object-cache.reducer';
import { TypedObject } from '../typed-object.model';

export const DATA_SERVICE_FACTORY = new InjectionToken<(resourceType: ResourceType) => GenericConstructor<any>>('getDataServiceFor', {
  providedIn: 'root',
  factory: () => getDataServiceFor,
});
export const LINK_DEFINITION_FACTORY = new InjectionToken<<T extends HALResource>(source: GenericConstructor<T>, linkName: keyof T['_links']) => LinkDefinition<T>>('getLinkDefinition', {
  providedIn: 'root',
  factory: () => getLinkDefinition,
});
export const LINK_DEFINITION_MAP_FACTORY = new InjectionToken<<T extends HALResource>(source: GenericConstructor<T>) => Map<keyof T['_links'], LinkDefinition<T>>>('getLinkDefinitions', {
  providedIn: 'root',
  factory: () => getLinkDefinitions,
});

const resolvedLinkKey = Symbol('resolvedLink');

const resolvedLinkMap = new Map();
const typeMap = new Map();
const dataServiceMap = new Map();
const linkMap = new Map();

/**
 * Decorator function to map a ResourceType to its class
 * @param target the typed class to map
 */
export function typedObject(target: TypedObject) {
  typeMap.set(target.type.value, target);
}

/**
 * Returns the mapped class for the given type
 * @param type The resource type
 */
export function getClassForType(type: string | ResourceType) {
  return typeMap.get(getResourceTypeValueFor(type));
}

/**
 * A class decorator to indicate that this class is a dataservice
 * for a given resource type.
 *
 * "dataservice" in this context means that it has findByHref and
 * findAllByHref methods.
 *
 * @param resourceType the resource type the class is a dataservice for
 */
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

/**
 * Return the dataservice matching the given resource type
 *
 * @param resourceType the resource type you want the matching dataservice for
 */
export function getDataServiceFor<T extends CacheableObject>(resourceType: ResourceType) {
  return dataServiceMap.get(resourceType.value);
}

/**
 * A class to represent the data that can be set by the @link decorator
 */
export class LinkDefinition<T extends HALResource> {
  resourceType: ResourceType;
  isList = false;
  linkName: keyof T['_links'];
  propertyName: keyof T;
}

/**
 * A property decorator to indicate that a certain property is the placeholder
 * where the contents of a resolved link should be stored.
 *
 * e.g. if an Item has an hal link for bundles, and an item.bundles property
 * this decorator should decorate that item.bundles property.
 *
 * @param resourceType the resource type of the object(s) the link retrieves
 * @param isList an optional boolean indicating whether or not it concerns a list,
 * defaults to false
 * @param linkName an optional string in case the {@link HALLink} name differs from the
 * property name
 */
export const link = <T extends HALResource>(
  resourceType: ResourceType,
  isList = false,
  linkName?: keyof T['_links'],
) => {
  return (target: T, propertyName: string) => {
    let targetMap = linkMap.get(target.constructor);

    if (hasNoValue(targetMap)) {
      targetMap = new Map<keyof T['_links'], LinkDefinition<T>>();
    }

    if (hasNoValue(linkName)) {
      linkName = propertyName as any;
    }

    targetMap.set(linkName, {
      resourceType,
      isList,
      linkName,
      propertyName,
    });

    linkMap.set(target.constructor, targetMap);
  };
};

/**
 * Returns all LinkDefinitions for a model class
 * @param source
 */
export const getLinkDefinitions = <T extends HALResource>(source: GenericConstructor<T>): Map<keyof T['_links'], LinkDefinition<T>> => {
  return linkMap.get(source);
};

/**
 * Returns a specific LinkDefinition for a model class
 *
 * @param source the model class
 * @param linkName the name of the link
 */
export const getLinkDefinition = <T extends HALResource>(source: GenericConstructor<T>, linkName: keyof T['_links']): LinkDefinition<T> => {
  const sourceMap = linkMap.get(source);
  if (hasValue(sourceMap)) {
    return sourceMap.get(linkName);
  } else {
    return undefined;
  }
};

/**
 * A class level decorator to indicate you want to inherit @link annotations
 * from a parent class.
 *
 * @param parent the parent class to inherit @link annotations from
 */
export function inheritLinkAnnotations(parent: any): any {
  return (child: any) => {
    const parentMap: Map<string, LinkDefinition<any>> = linkMap.get(parent) || new Map();
    const childMap: Map<string, LinkDefinition<any>> = linkMap.get(child) || new Map();

    parentMap.forEach((value, key) => {
      if (!childMap.has(key)) {
        childMap.set(key, value);
      }
    });

    linkMap.set(child, childMap);
  };
}
