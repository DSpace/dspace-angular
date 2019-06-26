import { ItemMetadataRepresentation } from '../../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import { MetadataRepresentation } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { MetadatumRepresentation } from '../../../../core/shared/metadata-representation/metadatum/metadatum-representation.model';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { getSucceededRemoteData } from '../../../../core/shared/operators';
import { hasValue } from '../../../../shared/empty.util';
import { Observable } from 'rxjs/internal/Observable';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import { distinctUntilChanged, filter, flatMap, map, tap } from 'rxjs/operators';
import { of as observableOf, zip as observableZip, combineLatest as observableCombineLatest } from 'rxjs';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { RelationshipService } from '../../../../core/data/relationship.service';

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
 * @returns {(source: Observable<[Relationship[] , RelationshipType[]]>) => Observable<Relationship[]>}
 */
export const filterRelationsByTypeLabel = (label: string) =>
  (source: Observable<[Relationship[], RelationshipType[]]>): Observable<Relationship[]> =>
    source.pipe(
      map(([relsCurrentPage, relTypesCurrentPage]) =>
        relsCurrentPage.filter((rel: Relationship, idx: number) =>
          hasValue(relTypesCurrentPage[idx]) && (relTypesCurrentPage[idx].leftLabel === label ||
          relTypesCurrentPage[idx].rightLabel === label)
        )
      ),
      distinctUntilChanged(compareArraysUsingIds())
    );

/**
 * Operator for turning a list of relationships into a list of the relevant items
 * @param {string} thisId           The item's id of which the relations belong to
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
          })),
      distinctUntilChanged(compareArraysUsingIds()),
    );

/**
 * Operator for turning a list of relationships into a list of metadatarepresentations given the original metadata
 * @param parentId    The id of the parent item
 * @param itemType    The type of relation this list resembles (for creating representations)
 * @param metadata    The list of original Metadatum objects
 * @param ids         The ItemDataService to use for fetching Items from the Rest API
 */
export const relationsToRepresentations = (parentId: string, itemType: string, metadata: MetadataValue[], ids: ItemDataService) =>
  (source: Observable<Relationship[]>): Observable<MetadataRepresentation[]> =>
    source.pipe(
      flatMap((rels: Relationship[]) =>
        observableZip(
          ...metadata
            .map((metadatum: any) => Object.assign(new MetadataValue(), metadatum))
            .map((metadatum: MetadataValue) => {
              if (metadatum.isVirtual) {
                const matchingRels = rels.filter((rel: Relationship) => ('' + rel.id) === metadatum.virtualValue);
                if (matchingRels.length > 0) {
                  const matchingRel = matchingRels[0];
                  return observableCombineLatest(matchingRel.leftItem, matchingRel.rightItem).pipe(
                    map(([leftItem, rightItem]) => {
                      if (leftItem.payload.id === parentId) {
                        return rightItem.payload;
                      } else if (rightItem.payload.id === parentId) {
                        return leftItem.payload;
                      }
                    }),
                    map((item: Item) => Object.assign(new ItemMetadataRepresentation(), item))
                  );
                }
              } else {
                return observableOf(Object.assign(new MetadatumRepresentation(itemType), metadatum));
              }
            })
        )
      )
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
