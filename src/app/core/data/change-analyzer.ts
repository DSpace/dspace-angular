import { NormalizedObject } from '../cache/models/normalized-object.model';
import { Operation } from 'fast-json-patch/lib/core';

/**
 * An interface to determine what differs between two
 * NormalizedObjects
 */
export interface ChangeAnalyzer<TNormalized extends NormalizedObject> {

  /**
   * Compare two objects and return their differences as a
   * JsonPatch Operation Array
   *
   * @param {NormalizedObject} object1
   *    The first object to compare
   * @param {NormalizedObject} object2
   *    The second object to compare
   */
  diff(object1: TNormalized, object2: TNormalized):  Operation[];
}
