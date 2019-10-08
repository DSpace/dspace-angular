import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../core/shared/operators';
import { hasNoValue, hasValue } from '../../../../shared/empty.util';
import { Observable } from 'rxjs/internal/Observable';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import { distinctUntilChanged, flatMap, map, switchMap } from 'rxjs/operators';
import { zip as observableZip, combineLatest as observableCombineLatest } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { RelationshipService } from '../../../../core/data/relationship.service';
import { PaginatedList } from '../../../../core/data/paginated-list';

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
      return false
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
 * Fetch the relationships which match the type label given
 * @param {string} label      Type label
 * @param thisId              The item's id of which the relations belong to
 * @returns {(source: Observable<[Relationship[] , RelationshipType[]]>) => Observable<Relationship[]>}
 */
export const filterRelationsByTypeLabel = (label: string, thisId?: string) =>
  (source: Observable<[Relationship[], RelationshipType[]]>): Observable<Relationship[]> =>
    source.pipe(
      switchMap(([relsCurrentPage, relTypesCurrentPage]) => {
        const relatedItems$ = observableZip(...relsCurrentPage.map((rel: Relationship) =>
            observableCombineLatest(
              rel.leftItem.pipe(getSucceededRemoteData(), getRemoteDataPayload()),
              rel.rightItem.pipe(getSucceededRemoteData(), getRemoteDataPayload()))
          )
        );
        return relatedItems$.pipe(
          map((arr) => relsCurrentPage.filter((rel: Relationship, idx: number) =>
            hasValue(relTypesCurrentPage[idx]) && (
              (hasNoValue(thisId) && (relTypesCurrentPage[idx].leftwardType === label ||
                relTypesCurrentPage[idx].rightwardType === label)) ||
              (thisId === arr[idx][0].id && relTypesCurrentPage[idx].leftwardType === label) ||
              (thisId === arr[idx][1].id && relTypesCurrentPage[idx].rightwardType === label)
            )
          ))
        );
      }),
      distinctUntilChanged(compareArraysUsingIds())
    );

/**
 * Operator for turning a list of relationships into a list of the relevant items
 * @param {string} thisId       The item's id of which the relations belong to
 * @returns {(source: Observable<Relationship[]>) => Observable<Item[]>}
 */
export const relationsToItems = (thisId: string) =>
  (source: Observable<Relationship[]>): Observable<Item[]> =>
    source.pipe(
      flatMap((rels: Relationship[]) =>
        observableZip(
          ...rels.map((rel: Relationship) => observableCombineLatest(rel.leftItem, rel.rightItem))
        )
      ),
      map((arr) =>
        arr
          .filter(([leftItem, rightItem]) => leftItem.hasSucceeded && rightItem.hasSucceeded)
          .map(([leftItem, rightItem]) => {
            if (leftItem.payload.id === thisId) {
              return rightItem.payload;
            } else if (rightItem.payload.id === thisId) {
              return leftItem.payload;
            }
          })
          .filter((item: Item) => hasValue(item))
      ),
      distinctUntilChanged(compareArraysUsingIds()),
    );

/**
 * Operator for turning a paginated list of relationships into a paginated list of the relevant items
 * The result is wrapped in the original RemoteData and PaginatedList
 * @param {string} thisId       The item's id of which the relations belong to
 * @returns {(source: Observable<Relationship[]>) => Observable<Item[]>}
 */
export const paginatedRelationsToItems = (thisId: string) =>
  (source: Observable<RemoteData<PaginatedList<Relationship>>>): Observable<RemoteData<PaginatedList<Item>>> =>
    source.pipe(
      getSucceededRemoteData(),
      switchMap((relationshipsRD: RemoteData<PaginatedList<Relationship>>) => {
        return observableZip(
          ...relationshipsRD.payload.page.map((rel: Relationship) => observableCombineLatest(rel.leftItem, rel.rightItem))
        ).pipe(
          map((arr) =>
            arr
              .filter(([leftItem, rightItem]) => leftItem.hasSucceeded && rightItem.hasSucceeded)
              .map(([leftItem, rightItem]) => {
                if (leftItem.payload.id === thisId) {
                  return rightItem.payload;
                } else if (rightItem.payload.id === thisId) {
                  return leftItem.payload;
                }
              })
              .filter((item: Item) => hasValue(item))
          ),
          distinctUntilChanged(compareArraysUsingIds()),
          map((relatedItems: Item[]) =>
            Object.assign(relationshipsRD, { payload: Object.assign(relationshipsRD.payload, { page: relatedItems } )})
          )
        )
      })
    );

/**
 * Operator for fetching an item's relationships, but filtered by related item IDs (essentially performing a reverse lookup)
 * Only relationships where leftItem or rightItem's ID is present in the list provided will be returned
 * @param item
 * @param relationshipService
 */
export const getRelationsByRelatedItemIds = (item: Item, relationshipService: RelationshipService) =>
  (source: Observable<string[]>): Observable<Relationship[]> =>
    source.pipe(
      flatMap((relatedItemIds: string[]) => relationshipService.getItemResolvedRelatedItemsAndRelationships(item).pipe(
        map(([leftItems, rightItems, rels]) => rels.filter((rel: Relationship, index: number) => relatedItemIds.indexOf(leftItems[index].uuid) > -1 || relatedItemIds.indexOf(rightItems[index].uuid) > -1))
      ))
    );
