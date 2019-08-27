import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RemoteData } from '../../../../core/data/remote-data';
import { Item } from '../../../../core/shared/item.model';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { MetadataRepresentation } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { RelationshipService } from '../../../../core/data/relationship.service';
import { relationsToRepresentations } from './item-relationships-utils';

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
