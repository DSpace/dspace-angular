import { Component, Inject } from '@angular/core';
import { Observable ,  zip as observableZip, combineLatest as observableCombineLatest } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RemoteData } from '../../../../core/data/remote-data';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { Item } from '../../../../core/shared/item.model';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { MetadataRepresentation } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { ItemMetadataRepresentation } from '../../../../core/shared/metadata-representation/item/item-metadata-representation.model';
import { MetadatumRepresentation } from '../../../../core/shared/metadata-representation/metadatum/metadatum-representation.model';
import { of } from 'rxjs/internal/observable/of';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { RelationshipService } from '../../../../core/data/relationship.service';

/**
 * Operator for turning a list of relationships into a list of metadatarepresentations given the original metadata
 * @param thisId      The id of the parent item
 * @param itemType    The type of relation this list resembles (for creating representations)
 * @param metadata    The list of original Metadatum objects
 */
export const relationsToRepresentations = (thisId: string, itemType: string, metadata: MetadataValue[]) =>
  (source: Observable<RemoteData<PaginatedList<Relationship>>>): Observable<RemoteData<PaginatedList<MetadataRepresentation>>> =>
    source.pipe(
      flatMap((relRD: RemoteData<PaginatedList<Relationship>>) =>
        observableZip(
          ...metadata
            .map((metadatum: any) => Object.assign(new MetadataValue(), metadatum))
            .map((metadatum: MetadataValue) => {
            if (metadatum.isVirtual) {
              const matchingRels = relRD.payload.page.filter((rel: Relationship) => ('' + rel.id) === metadatum.virtualValue);
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
        ).pipe(
          map((representations: MetadataRepresentation[]) => Object.assign(relRD, { payload: { page: representations } }))
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
export class ItemComponent {

  constructor(
    @Inject(ITEM) public item: Item,
    public relationshipService: RelationshipService
  ) {}

  /**
   * Build a list of MetadataRepresentations for the current item. This combines all metadata and relationships of a
   * certain type.
   * @param itemType          The type of item we're building representations of. Used for matching templates.
   * @param metadataField     The metadata field that resembles the item type.
   * @param relationshipLabel The label to use to fetch relationships to create MetadataRepresentations for.
   */
  buildRepresentations(itemType: string, metadataField: string, relationshipLabel: string): Observable<RemoteData<PaginatedList<MetadataRepresentation>>> {
    const metadata = this.item.findMetadataSortedByPlace(metadataField);
    const relationships$ = this.relationshipService.getItemRelationshipsByLabel(this.item, relationshipLabel);

    return relationships$.pipe(
      relationsToRepresentations(this.item.id, itemType, metadata)
    );
  }

}
