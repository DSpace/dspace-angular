import { InjectionToken } from '@angular/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of as observableOf,
  zip as observableZip,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  mergeMap,
  switchMap,
} from 'rxjs/operators';

import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Item } from '../../../../core/shared/item.model';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { hasValue } from '../../../../shared/empty.util';

export const PAGINATED_RELATIONS_TO_ITEMS_OPERATOR = new InjectionToken<(thisId: string) => (source: Observable<RemoteData<PaginatedList<Relationship>>>) => Observable<RemoteData<PaginatedList<Item>>>>('paginatedRelationsToItems', {
  providedIn: 'root',
  factory: () => paginatedRelationsToItems,
});

/**
 * Operator for comparing arrays using a mapping function
 * The mapping function should turn the source array into an array of basic types, so that the array can
 * be compared using these basic types.
 * For example: "(o) => o.id" will compare the two arrays by comparing their content by id.
 * @param mapFn   Function for mapping the arrays
 */
export const compareArraysUsing = <T>(mapFn: (t: T) => any) =>
  (a: T[], b: T[]): boolean => {
    if (!Array.isArray(a) || ! Array.isArray(b)) {
      return false;
    }

    const aIds = a.map(mapFn);
    const bIds = b.map(mapFn);

    return aIds.length === bIds.length &&
      aIds.every((e) => bIds.includes(e)) &&
      bIds.every((e) => aIds.includes(e));
  };

/**
 * Operator for comparing arrays using the object's ids
 */
export const compareArraysUsingIds = <T extends { id: string }>() =>
  compareArraysUsing((t: T) => hasValue(t) ? t.id : undefined);

/**
 * Operator for turning a list of relationships into a list of the relevant items
 * @param {string} thisId       The item's id of which the relations belong to
 */
export const relationsToItems = (thisId: string): (source: Observable<Relationship[]>) => Observable<Item[]> =>
  (source: Observable<Relationship[]>): Observable<Item[]> =>
    source.pipe(
      mergeMap((relationships: Relationship[]) => {
        if (relationships.length === 0) {
          return observableOf([]);
        }
        return observableZip(
          ...relationships.map((rel: Relationship) => observableCombineLatest([rel.leftItem, rel.rightItem])),
        );
      }),
      map((arr: [RemoteData<Item>, RemoteData<Item>][]) =>
        arr
          .filter(([leftItem, rightItem]) => leftItem.hasSucceeded && rightItem.hasSucceeded)
          .map(([leftItem, rightItem]) => {
            if (leftItem.payload.id === thisId) {
              return rightItem.payload;
            } else if (rightItem.payload.id === thisId) {
              return leftItem.payload;
            }
          })
          .filter((item: Item) => hasValue(item)),
      ),
      distinctUntilChanged(compareArraysUsingIds()),
    );

/**
 * Operator for turning a paginated list of relationships into a paginated list of the relevant items
 * The result is wrapped in the original RemoteData and PaginatedList
 * @param {string} thisId       The item's id of which the relations belong to
 * @returns {(source: Observable<Relationship[]>) => Observable<Item[]>}
 */
export const paginatedRelationsToItems = (thisId: string) => (source: Observable<RemoteData<PaginatedList<Relationship>>>): Observable<RemoteData<PaginatedList<Item>>> =>
  source.pipe(
    getFirstCompletedRemoteData(),
    switchMap((relationshipsRD: RemoteData<PaginatedList<Relationship>>) => {
      return observableCombineLatest(
        relationshipsRD.payload.page.map((rel: Relationship) =>
          observableCombineLatest([
            rel.leftItem.pipe(
              getFirstCompletedRemoteData(),
              map((rd: RemoteData<Item>) => {
                if (rd.hasSucceeded) {
                  return rd.payload;
                } else {
                  return null;
                }
              }),
            ),
            rel.rightItem.pipe(
              getFirstCompletedRemoteData(),
              map((rd: RemoteData<Item>) => {
                if (rd.hasSucceeded) {
                  return rd.payload;
                } else {
                  return null;
                }
              }),
            ),
          ],
          ),
        ),
      ).pipe(
        map((arr) =>
          arr.map(([leftItem, rightItem]) => {
            if (hasValue(leftItem) && leftItem.id === thisId) {
              return rightItem;
            } else if (hasValue(rightItem) && rightItem.id === thisId) {
              return leftItem;
            }
          })
            .filter((item: Item) => hasValue(item)),
        ),
        distinctUntilChanged(compareArraysUsingIds()),
        map((relatedItems: Item[]) =>
          Object.assign(relationshipsRD, { payload: Object.assign(relationshipsRD.payload, { page: relatedItems } ) }),
        ),
      );
    }),
  );
