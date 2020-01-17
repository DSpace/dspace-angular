import { NormalizedObject } from '../cache/models/normalized-object.model';
import { Operation } from 'fast-json-patch/lib/core';
import { CacheableObject } from '../cache/object-cache.reducer';

/**
 * An interface to determine what differs between two
 * NormalizedObjects
 */
export interface ChangeAnalyzer<T extends CacheableObject> {

  /**
   * Compare two objects and return their differences as a
   * JsonPatch Operation Array
   *
   * @param {NormalizedObject} object1
   *    The first object to compare
   * @param {NormalizedObject} object2
   *    The second object to compare
   */
  diff(object1: T | NormalizedObject<T>, object2: T | NormalizedObject<T>): Operation[];
}
