import { MoveOperation } from 'fast-json-patch';
import { Injectable } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { hasValue } from '../../shared/empty.util';

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
      if (hasValue(value)) {
        const otherIndex = array2.indexOf(value);
        const movedIndex = moved.indexOf(value);
        if (index !== otherIndex && movedIndex !== otherIndex) {
          moveItemInArray(moved, movedIndex, otherIndex);
          result.push(Object.assign({
            op: 'move',
            from: '/' + movedIndex,
            path: '/' + otherIndex
          }) as MoveOperation);
        }
      }
    });
    return result;
  }
}
