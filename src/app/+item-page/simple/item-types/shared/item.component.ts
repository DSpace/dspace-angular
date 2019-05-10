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
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { MetadataRepresentation } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { ItemMetadataRepresentation } from '../../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import { MetadatumRepresentation } from '../../../../core/shared/metadata-representation/metadatum/metadatum-representation.model';
import { of } from 'rxjs/internal/observable/of';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { compareArraysUsingIds } from './item-relationships-utils';

/**
 * Operator for turning a list of relationships into a list of metadatarepresentations given the original metadata
 * @param thisId      The id of the parent item
 * @param itemType    The type of relation this list resembles (for creating representations)
 * @param metadata    The list of original Metadatum objects
 */
export const relationsToRepresentations = (thisId: string, itemType: string, metadata: MetadataValue[]) =>
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
                  filter(([leftItem, rightItem]) => leftItem.hasSucceeded && rightItem.hasSucceeded),
                  map(([leftItem, rightItem]) => {
                    if (leftItem.payload.id === thisId) {
                      return rightItem.payload;
                    } else if (rightItem.payload.id === thisId) {
                      return leftItem.payload;
                    }
                  }),
                  map((item: Item) => Object.assign(new ItemMetadataRepresentation(), item))
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
   */
  buildRepresentations(itemType: string, metadataField: string): Observable<MetadataRepresentation[]> {
    const metadata = this.item.findMetadataSortedByPlace(metadataField);
    const relsCurrentPage$ = this.item.relationships.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
      map((pl: PaginatedList<Relationship>) => pl.page),
      distinctUntilChanged(compareArraysUsingIds())
    );

    return relsCurrentPage$.pipe(
      relationsToRepresentations(this.item.id, itemType, metadata)
    );
  }

}
