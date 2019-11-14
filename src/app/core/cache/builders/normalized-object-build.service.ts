import { Injectable } from '@angular/core';
import { NormalizedObject } from '../models/normalized-object.model';
import { getMapsToType, getRelationships } from './build-decorators';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { CacheableObject, TypedObject } from '../object-cache.reducer';

/**
 * Return true if halObj has a value for `_links.self`
 *
 * @param {any} halObj The object to test
 */
export function isRestDataObject(halObj: any): boolean {
  return isNotEmpty(halObj._links) && hasValue(halObj._links.self);
}

/**
 * Return true if halObj has a value for `page` and  `_embedded`
 *
 * @param {any} halObj The object to test
 */
export function isRestPaginatedList(halObj: any): boolean {
  return hasValue(halObj.page) && hasValue(halObj._embedded);
}

/**
 * A service to turn domain models in to their normalized
 * counterparts.
 */
@Injectable()
export class NormalizedObjectBuildService {

  /**
   * Returns the normalized model that corresponds to the given domain model
   *
   * @param {TDomain} domainModel a domain model
   */
  normalize<T extends CacheableObject>(domainModel: T): NormalizedObject<T> {
    const normalizedConstructor = getMapsToType((domainModel as any).type);
    const relationships = getRelationships(normalizedConstructor) || [];
    const normalizedModel = Object.assign({}, domainModel) as any;
    relationships.forEach((key: string) => {
      if (hasValue(normalizedModel[key])) {
        normalizedModel[key] = normalizedModel._links[key];
      }
    });
    return normalizedModel;
  }
}
