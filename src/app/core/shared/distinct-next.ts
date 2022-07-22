/*
 * something something atmire
 */

import { BehaviorSubject } from 'rxjs';

/**
 * Use nextValue to update a given BehaviorSubject, only if it differs from its current value
 *
 * @param bs a BehaviorSubject
 * @param nextValue the next value for that BehaviorSubject
 * @protected
 */
export function distinctNext<T>(bs: BehaviorSubject<T>, nextValue: T): void {
  if (bs.getValue() !== nextValue) {
    bs.next(nextValue);
  }
}
