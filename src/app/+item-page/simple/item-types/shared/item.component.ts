import { Component, Inject, OnInit } from '@angular/core';
import { combineLatest as observableCombineLatest, Observable, zip as observableZip } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map } from 'rxjs/operators';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RemoteData } from '../../../../core/data/remote-data';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { Item } from '../../../../core/shared/item.model';
import { MetadataRepresentation } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../../core/shared/operators';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { compareArraysUsingIds, relationsToRepresentations } from './item-relationships-utils';

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
