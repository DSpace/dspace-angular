import { Injectable } from '@angular/core';
import { compare } from 'fast-json-patch';
import { Operation } from 'fast-json-patch/lib/core';
import { getClassForType } from '../cache/builders/build-decorators';
import { CacheableObject } from '../cache/object-cache.reducer';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { ChangeAnalyzer } from './change-analyzer';

/**
 * A class to determine what differs between two
 * CacheableObjects
 */
@Injectable()
export class DefaultChangeAnalyzer<T extends CacheableObject> implements ChangeAnalyzer<T> {
  /**
   * Compare the metadata of two CacheableObject and return the differences as
   * a JsonPatch Operation Array
   *
   * @param {CacheableObject} object1
   *    The first object to compare
   * @param {CacheableObject} object2
   *    The second object to compare
   */
  diff(object1: T, object2: T): Operation[] {
    const serializer1 = new DSpaceSerializer(getClassForType(object1.type));
    const serializer2 = new DSpaceSerializer(getClassForType(object2.type));
    return compare(serializer1.serialize(object1), serializer2.serialize(object2));
  }
}
