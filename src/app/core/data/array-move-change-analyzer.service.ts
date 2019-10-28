import { MoveOperation, Operation } from 'fast-json-patch/lib/core';
import { compare } from 'fast-json-patch';
import { ChangeAnalyzer } from './change-analyzer';
import { Injectable } from '@angular/core';
import { CacheableObject } from '../cache/object-cache.reducer';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { moveItemInArray } from '@angular/cdk/drag-drop';

/**
 * A class to determine move operations between two arrays
 */
@Injectable()
export class ArrayMoveChangeAnalyzer<T> {

  /**
   * Compare two arrays detecting and returning move operations
   *
   * @param array1  The original array
   * @param array2  The custom array to compare with the original
   */
  diff(array1: T[], array2: T[]): MoveOperation[] {
    const result = [];
    const moved = [...array1];
    array1.forEach((value: T, index: number) => {
      const otherIndex = array2.indexOf(value);
      const movedIndex = moved.indexOf(value);
      if (index !== otherIndex && movedIndex !== otherIndex) {
        moveItemInArray(moved, movedIndex, otherIndex);
        result.push(Object.assign({
          op: 'move',
          from: '/' + movedIndex,
          path: '/' + otherIndex
        }) as MoveOperation)
      }
    });
    return result;
  }
}
