import { Component, Inject, OnInit } from '@angular/core';
import { Observable ,  zip as observableZip, combineLatest as observableCombineLatest } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map } from 'rxjs/operators';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RemoteData } from '../../../../core/data/remote-data';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { Item } from '../../../../core/shared/item.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../core/shared/operators';
import { hasNoValue, hasValue } from '../../../../shared/empty.util';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { MetadataRepresentation } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { ItemMetadataRepresentation } from '../../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import { MetadatumRepresentation } from '../../../../core/shared/metadata-representation/metadatum/metadatum-representation.model';
import { of } from 'rxjs/internal/observable/of';
import { MetadataValue } from '../../../../core/shared/metadata.models';

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
 * @param {ItemDataService} ids     The ItemDataService to fetch items from the REST API
 * @returns {(source: Observable<Relationship[]>) => Observable<Item[]>}
 */
export const relationsToItems = (thisId: string, ids: ItemDataService) =>
  (source: Observable<Relationship[]>): Observable<Item[]> =>
    source.pipe(
      flatMap((rels: Relationship[]) =>
        observableZip(
          ...rels.map((rel: Relationship) => {
            let queryId = rel.leftId;
            if (rel.leftId === thisId) {
              queryId = rel.rightId;
            }
            return ids.findById(queryId);
          })
        )
      ),
      map((arr: Array<RemoteData<Item>>) =>
        arr
          .filter((d: RemoteData<Item>) => d.hasSucceeded)
          .map((d: RemoteData<Item>) => d.payload)),
      distinctUntilChanged(compareArraysUsingIds()),
    );

/**
 * Operator for turning a list of relationships into a list of metadatarepresentations given the original metadata
 * @param thisId      The id of the parent item
 * @param itemType    The type of relation this list resembles (for creating representations)
 * @param metadata    The list of original Metadatum objects
 * @param ids         The ItemDataService to use for fetching Items from the Rest API
 */
export const relationsToRepresentations = (thisId: string, itemType: string, metadata: MetadataValue[], ids: ItemDataService) =>
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
                let queryId = matchingRel.leftId;
                if (matchingRel.leftId === thisId) {
                  queryId = matchingRel.rightId;
                }
                return ids.findById(queryId).pipe(
                  getSucceededRemoteData(),
                  map((d: RemoteData<Item>) => Object.assign(new ItemMetadataRepresentation(itemType), d.payload))
                );
              }
            } else {
              return of(Object.assign(new MetadatumRepresentation(itemType), metadatum));
            }
          })
        )
      )
    );

@Component({
  selector: 'ds-item',
  template: ''
})
/**
 * A generic component for displaying metadata and relations of an item
 */
export class ItemComponent implements OnInit {
  /**
   * Resolved relationships and types together in one observable
   */
  resolvedRelsAndTypes$: Observable<[Relationship[], RelationshipType[]]>;

  constructor(
    @Inject(ITEM) public item: Item
  ) {}

  ngOnInit(): void {
    const relationships$ = this.item.relationships;
    if (relationships$) {
      const relsCurrentPage$ = relationships$.pipe(
        filter((rd: RemoteData<PaginatedList<Relationship>>) => rd.hasSucceeded),
        getRemoteDataPayload(),
        map((pl: PaginatedList<Relationship>) => pl.page),
        distinctUntilChanged(compareArraysUsingIds())
      );

      const relTypesCurrentPage$ = relsCurrentPage$.pipe(
        flatMap((rels: Relationship[]) =>
          observableZip(...rels.map((rel: Relationship) => rel.relationshipType)).pipe(
            map(([...arr]: Array<RemoteData<RelationshipType>>) => arr.map((d: RemoteData<RelationshipType>) => d.payload))
          )
        ),
        distinctUntilChanged(compareArraysUsingIds())
      );

      this.resolvedRelsAndTypes$ = observableCombineLatest(
        relsCurrentPage$,
        relTypesCurrentPage$
      );
    }
  }

  /**
   * Build a list of MetadataRepresentations for the current item. This combines all metadata and relationships of a
   * certain type.
   * @param itemType          The type of item we're building representations of. Used for matching templates.
   * @param metadataField     The metadata field that resembles the item type.
   * @param itemDataService   ItemDataService to turn relations into items.
   */
  buildRepresentations(itemType: string, metadataField: string, itemDataService: ItemDataService): Observable<MetadataRepresentation[]> {
    const metadata = this.item.findMetadataSortedByPlace(metadataField);
    const relsCurrentPage$ = this.item.relationships.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      map((pl: PaginatedList<Relationship>) => pl.page),
      distinctUntilChanged(compareArraysUsingIds())
    );

    return relsCurrentPage$.pipe(
      relationsToRepresentations(this.item.id, itemType, metadata, itemDataService)
    );
  }

}
