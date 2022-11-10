import { Component, Input, OnInit } from '@angular/core';
import { hasValue, isNotEmpty } from '../empty.util';
import { Item } from '../../core/shared/item.model';
import { environment } from '../../../environments/environment';
import { MetadataValue } from '../../core/shared/metadata.models';
import { PLACEHOLDER_PARENT_METADATA } from '../form/builder/ds-dynamic-form-ui/ds-dynamic-form-constants';
import { RemoteData } from '../../core/data/remote-data';

import { Observable, of as observableOf } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ItemDataService } from '../../core/data/item-data.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { Metadata } from '../../core/shared/metadata.utils';

interface MetadataView {
  authority: string;
  icon: string;
  value: string;
  orcidAuthenticated: string;
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
   * Item of the metadata value
   */
  @Input() item: Item;
  /**
   * Processed metadata to create MetadataOrcid with the informations needed to show
   */
  metadata$: Observable<MetadataView>;
  /**
   * Map icons of the respective entity types
   */
  private entity2icon: Map<string, string>;

  /**
   * Map all entities with the icons specified in the envoirment configuration file
   */
  constructor(private itemService: ItemDataService) {
    this.entity2icon = new Map();
    const confValue = environment.crisLayout.crisRef;
    confValue.forEach((config) => {
      if (config.entityType && config.icon) {
        this.entity2icon.set(config.entityType.toUpperCase(), config.icon);
      } else {
        console.warn(`Incomplete configuration found in 'environment.crisLayout.crisRef':\n{ entityType: ${config.entityType}, icon: ${config.icon} }`);
      }
    });
  }

  /**
   * On init process metadata to get the informations and form MetadataOrcid model
   */
  ngOnInit(): void {
    this.metadata$ = observableOf(this.metadata).pipe(
      switchMap((metadataValue: MetadataValue) => {
        if (Metadata.hasValidAuthority(metadataValue.authority)) {
          return this.itemService.findById(metadataValue.authority).pipe(
            getFirstCompletedRemoteData(),
            map((itemRD: RemoteData<Item>) => {
              if (itemRD.hasSucceeded) {
                return {
                  authority: metadataValue.authority,
                  icon: this.getIcon(itemRD.payload.firstMetadataValue('dspace.entity.type')),
                  value: metadataValue.value,
                  orcidAuthenticated: this.getOrcid(itemRD.payload)
                };
              } else {
                return {
                  authority: null,
                  icon: null,
                  value: metadataValue.value,
                  orcidAuthenticated: null
                };
              }
            })
          );
        } else {
          return observableOf({
            authority: null,
            icon: null,
            value: metadataValue.value,
            orcidAuthenticated: null
          });
        }
      })
    );
  }

  /**
   * Returns the icon configured for given entityType, or
   * default icon if configuration not exists
   * @param entityType entity type name, ex. Person
   */
  getIcon(entityType: string): string {
    return hasValue(entityType) && this.entity2icon.has(entityType.toUpperCase()) ?
      this.entity2icon.get(entityType.toUpperCase()) :
      this.entity2icon.get('DEFAULT');
  }

  /**
   * Returns the orcid for given item, or
   * null if there is no metadata authenticated for persion
   * @param referencedItem Item of the metadata being shown
   */
  getOrcid(referencedItem: Item): string {
    if (referencedItem.hasMetadata('dspace.orcid.authenticated')) {
      return referencedItem.firstMetadataValue('person.identifier.orcid');
    }
    return null;
  }

  /**
   * Normalize value to display
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
