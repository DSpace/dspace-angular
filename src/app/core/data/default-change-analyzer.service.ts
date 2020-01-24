import { Operation } from 'fast-json-patch/lib/core';
import { compare } from 'fast-json-patch';
import { ChangeAnalyzer } from './change-analyzer';
import { Injectable } from '@angular/core';
import { CacheableObject } from '../cache/object-cache.reducer';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';

/**
 * A class to determine what differs between two
 * CacheableObjects
 */
@Injectable()
export class DefaultChangeAnalyzer<T extends CacheableObject> implements ChangeAnalyzer<T> {
  constructor(private normalizeService: NormalizedObjectBuildService) {
  }

  /**
   * Compare the metadata of two CacheableObject and return the differences as
   * a JsonPatch Operation Array
   *
   * @param {NormalizedObject} object1
   *    The first object to compare
   * @param {NormalizedObject} object2
   *    The second object to compare
   */
  diff(object1: T | NormalizedObject<T>, object2: T | NormalizedObject<T>): Operation[] {
    return compare(this.normalizeService.normalize(object1), this.normalizeService.normalize(object2));
  }
}
