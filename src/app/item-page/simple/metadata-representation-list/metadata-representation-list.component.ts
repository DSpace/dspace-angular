import {
  AsyncPipe,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  zip as observableZip,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { BrowseService } from '../../../core/browse/browse.service';
import { BrowseDefinitionDataService } from '../../../core/browse/browse-definition-data.service';
import { RelationshipDataService } from '../../../core/data/relationship-data.service';
import { Item } from '../../../core/shared/item.model';
import { MetadataValue } from '../../../core/shared/metadata.models';
import { MetadataRepresentation } from '../../../core/shared/metadata-representation/metadata-representation.model';
import { MetadatumRepresentation } from '../../../core/shared/metadata-representation/metadatum/metadatum-representation.model';
import { getRemoteDataPayload } from '../../../core/shared/operators';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { MetadataFieldWrapperComponent } from '../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { MetadataRepresentationLoaderComponent } from '../../../shared/metadata-representation/metadata-representation-loader.component';
import { VarDirective } from '../../../shared/utils/var.directive';
import { AbstractIncrementalListComponent } from '../abstract-incremental-list/abstract-incremental-list.component';

@Component({
  selector: 'ds-metadata-representation-list',
  templateUrl: './metadata-representation-list.component.html',
  standalone: true,
  imports: [MetadataFieldWrapperComponent, NgFor, VarDirective, MetadataRepresentationLoaderComponent, NgIf, ThemedLoadingComponent, AsyncPipe, TranslateModule],
})
/**
 * This component is used for displaying metadata
 * It expects an item and a metadataField to fetch metadata
 * It expects an itemType to resolve the metadata to a an item
 * It expects a label to put on top of the list
 */
export class MetadataRepresentationListComponent extends AbstractIncrementalListComponent<Observable<MetadataRepresentation[]>> {
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
  @Input() metadataFields: string[];

  /**
   * An i18n label to use as a title for the list
   */
  @Input() label: string;

  /**
   * The amount to increment the list by when clicking "view more"
   * Defaults to 10
   * The default can optionally be overridden by providing the limit as input to the component
   */
  @Input() incrementBy = 10;

  /**
   * The total amount of metadata values available
   */
  total: number;

  constructor(
    public relationshipService: RelationshipDataService,
    protected browseDefinitionDataService: BrowseDefinitionDataService,
  ) {
    super();
  }

  /**
   * Get a specific page
   * @param page  The page to fetch
   */
  getPage(page: number): Observable<MetadataRepresentation[]> {
    const metadata = this.parentItem.findMetadataSortedByPlace(this.metadataFields);
    this.total = metadata.length;
    return this.resolveMetadataRepresentations(metadata, page);
  }

  /**
   * Resolve a list of metadata values to a list of metadata representations
   * @param metadata  The list of all metadata values
   * @param page      The page to return representations for
   */
  resolveMetadataRepresentations(metadata: MetadataValue[], page: number): Observable<MetadataRepresentation[]> {
    return observableZip(
      ...metadata
        .slice((this.objects.length * this.incrementBy), (this.objects.length * this.incrementBy) + this.incrementBy)
        .map((metadatum: any) => Object.assign(new MetadataValue(), metadatum))
        .map((metadatum: MetadataValue) => {
          if (metadatum.isVirtual) {
            return this.relationshipService.resolveMetadataRepresentation(metadatum, this.parentItem, this.itemType);
          } else {
            // Check for a configured browse link and return a standard metadata representation
            let searchKeyArray: string[] = [];
            this.metadataFields.forEach((field: string) => {
              searchKeyArray = searchKeyArray.concat(BrowseService.toSearchKeyArray(field));
            });
            return this.browseDefinitionDataService.findByFields(this.metadataFields).pipe(
              getRemoteDataPayload(),
              map((def) => Object.assign(new MetadatumRepresentation(this.itemType, def), metadatum)),
            );
          }
        }),
    );
  }
}
