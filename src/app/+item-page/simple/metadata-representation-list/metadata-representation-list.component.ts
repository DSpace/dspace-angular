import { Component, Input, OnInit } from '@angular/core';
import { MetadataRepresentation } from '../../../core/shared/metadata-representation/metadata-representation.model';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { RelationshipService } from '../../../core/data/relationship.service';
import { Item } from '../../../core/shared/item.model';
import { combineLatest as observableCombineLatest, of as observableOf, zip as observableZip } from 'rxjs';
import { MetadataValue } from '../../../core/shared/metadata.models';
import { MetadatumRepresentation } from '../../../core/shared/metadata-representation/metadatum/metadatum-representation.model';
import { filter, map, switchMap } from 'rxjs/operators';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { Relationship } from '../../../core/shared/item-relationships/relationship.model';
import { ItemMetadataRepresentation } from '../../../core/shared/metadata-representation/item/item-metadata-representation.model';

@Component({
  selector: 'ds-metadata-representation-list',
  templateUrl: './metadata-representation-list.component.html'
})
/**
 * This component is used for displaying metadata
 * It expects an item and a metadataField to fetch metadata
 * It expects an itemType to resolve the metadata to a an item
 * It expects a label to put on top of the list
 */
export class MetadataRepresentationListComponent implements OnInit {
  /**
   * The parent of the list of related items to display
   */
  @Input() parentItem: Item;

  /**
   * The type of item to create a representation of
   */
  @Input() itemType: string;

  /**
   * The metadata field to use for fetching metadata from the item
   */
  @Input() metadataField: string;

  /**
   * An i18n label to use as a title for the list
   */
  @Input() label: string;

  /**
   * The max amount of representations to display
   * Defaults to 10
   * The default can optionally be overridden by providing the limit as input to the component
   */
  @Input() limit = 10;

  /**
   * A list of metadata-representations to display
   */
  representations$: Observable<MetadataRepresentation[]>;

  /**
   * The originally provided limit
   * Used for resetting the limit to the original value when collapsing the list
   */
  originalLimit: number;

  /**
   * The total amount of metadata values available
   */
  total: number;

  constructor(public relationshipService: RelationshipService) {
  }

  ngOnInit(): void {
    this.originalLimit = this.limit;
    this.setRepresentations();
  }

  /**
   * Initialize the metadata representations
   */
  setRepresentations() {
    const metadata = this.parentItem.findMetadataSortedByPlace(this.metadataField);
    this.total = metadata.length;
    this.representations$ = this.resolveMetadataRepresentations(metadata);
  }

  /**
   * Resolve a list of metadata values to a list of metadata representations
   * @param metadata
   */
  resolveMetadataRepresentations(metadata: MetadataValue[]): Observable<MetadataRepresentation[]> {
    return observableZip(
      ...metadata
        .slice(0, this.limit)
        .map((metadatum: any) => Object.assign(new MetadataValue(), metadatum))
        .map((metadatum: MetadataValue) => {
          if (metadatum.isVirtual) {
            return this.relationshipService.findById(metadatum.virtualValue).pipe(
              getSucceededRemoteData(),
              switchMap((relRD: RemoteData<Relationship>) =>
                observableCombineLatest(relRD.payload.leftItem, relRD.payload.rightItem).pipe(
                  filter(([leftItem, rightItem]) => leftItem.hasSucceeded && rightItem.hasSucceeded),
                  map(([leftItem, rightItem]) => {
                    if (leftItem.payload.id === this.parentItem.id) {
                      return rightItem.payload;
                    } else if (rightItem.payload.id === this.parentItem.id) {
                      return leftItem.payload;
                    }
                  }),
                  map((item: Item) => Object.assign(new ItemMetadataRepresentation(metadatum), item))
                )
              ));
          } else {
            return observableOf(Object.assign(new MetadatumRepresentation(this.itemType), metadatum));
          }
        })
    );
  }

  /**
   * Expand the list to display all metadata representations
   */
  viewMore() {
    this.limit = 9999;
    this.setRepresentations();
  }

  /**
   * Collapse the list to display the originally displayed metadata representations
   */
  viewLess() {
    this.limit = this.originalLimit;
    this.setRepresentations();
  }
}
