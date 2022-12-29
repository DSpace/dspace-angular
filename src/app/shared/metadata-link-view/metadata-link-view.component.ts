import { Component, Input, OnInit } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { isNotEmpty } from '../empty.util';
import { Item } from '../../core/shared/item.model';
import { MetadataValue } from '../../core/shared/metadata.models';
import { PLACEHOLDER_PARENT_METADATA } from '../form/builder/ds-dynamic-form-ui/ds-dynamic-form-constants';
import { RemoteData } from '../../core/data/remote-data';
import { ItemDataService } from '../../core/data/item-data.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { Metadata } from '../../core/shared/metadata.utils';
import { environment } from '../../../environments/environment';

interface MetadataView {
  authority: string;
  value: string;
  orcidAuthenticated: string;
  entityType: string;
  entityStyle: string|string[];
}

@Component({
  selector: 'ds-metadata-link-view',
  templateUrl: './metadata-link-view.component.html',
  styleUrls: ['./metadata-link-view.component.scss']
})
export class MetadataLinkViewComponent implements OnInit {

  /**
   * Metadata value that we need to show in the template
   */
  @Input() metadata: MetadataValue;

  /**
   * Metadata name that we need to show in the template
   */
  @Input() metadataName: string|string[];

  /**
   * Item of the metadata value
   */
  @Input() item: Item;

  /**
   * The metadata name from where to take the value of the cris style
   */
  crisRefMetadata = environment.crisLayout.crisRefStyleMetadata || 'cris.entity.style';

  /**
   * Processed metadata to create MetadataOrcid with the information needed to show
   */
  metadataView$: Observable<MetadataView>;

  /**
   * Position of the Icon before/after the element
   */
  iconPosition = 'after';

  /**
   * Map all entities with the icons specified in the environment configuration file
   */
  constructor(private itemService: ItemDataService) { }

  /**
   * On init process metadata to get the information and form MetadataOrcid model
   */
  ngOnInit(): void {
    this.metadataView$ = observableOf(this.metadata).pipe(
      switchMap((metadataValue: MetadataValue) => {
        if (Metadata.hasValidAuthority(metadataValue.authority)) {
          return this.itemService.findById(metadataValue.authority).pipe(
            getFirstCompletedRemoteData(),
            map((itemRD: RemoteData<Item>) => {
              if (itemRD.hasSucceeded) {
                return {
                  authority: metadataValue.authority,
                  value: metadataValue.value,
                  orcidAuthenticated: this.getOrcid(itemRD.payload),
                  entityType: itemRD.payload?.entityType,
                  entityStyle: itemRD.payload?.firstMetadataValue(this.crisRefMetadata)
                };
              } else {
                return {
                  authority: null,
                  value: metadataValue.value,
                  orcidAuthenticated: null,
                  entityType: 'PRIVATE',
                  entityStyle: this.metadataName
                };
              }
            })
          );
        } else {
          return observableOf({
            authority: null,
            value: metadataValue.value,
            orcidAuthenticated: null,
            entityType: null,
            entityStyle: null
          });
        }
      }),
      take(1)
    );
  }

  /**
   * Returns the orcid for given item, or null if there is no metadata authenticated for person
   *
   * @param referencedItem Item of the metadata being shown
   */
  getOrcid(referencedItem: Item): string {
    if (referencedItem?.hasMetadata('dspace.orcid.authenticated')) {
      return referencedItem.firstMetadataValue('person.identifier.orcid');
    }
    return null;
  }

  /**
   * Normalize value to display
   *
   * @param value
   */
  normalizeValue(value: string): string {
    if (isNotEmpty(value) && value.includes(PLACEHOLDER_PARENT_METADATA)) {
      return '';
    } else {
      return value;
    }
  }

}
