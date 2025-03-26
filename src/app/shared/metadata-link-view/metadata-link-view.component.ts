import { Component, Input, OnInit } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { isEmpty, isNotEmpty } from '../empty.util';
import { Item } from '../../core/shared/item.model';
import { MetadataValue } from '../../core/shared/metadata.models';
import { PLACEHOLDER_PARENT_METADATA } from '../form/builder/ds-dynamic-form-ui/ds-dynamic-form-constants';
import { RemoteData } from '../../core/data/remote-data';
import { ItemDataService } from '../../core/data/item-data.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { Metadata } from '../../core/shared/metadata.utils';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { environment } from '../../../environments/environment';
import { followLink } from '../utils/follow-link-config.model';
import { MetadataView } from './metadata-view.model';

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
  @Input() item: DSpaceObject;
  /**
   * The metadata name from where to take the value of the cris style
   */
  crisRefMetadata = environment.crisLayout.crisRefStyleMetadata;

  /**
   * Processed metadata to create MetadataOrcid with the information needed to show
   */
  metadataView$: Observable<MetadataView>;

  /**
   * Position of the Icon before/after the element
   */
  iconPosition = 'after';

  /**
   * Related item of the metadata value
   */
  relatedItem: Item;

  /**
   * Map all entities with the icons specified in the environment configuration file
   */
  constructor(private itemService: ItemDataService) { }

  /**
   * On init process metadata to get the information and form MetadataOrcid model
   */
  ngOnInit(): void {
    this.metadataView$ = observableOf(this.metadata).pipe(
      switchMap((metadataValue: MetadataValue) => this.getMetadataView(metadataValue)),
      take(1)
    );
  }


  /**
   * Retrieves the metadata view for a given metadata value.
   * If the metadata value has a valid authority, it retrieves the item using the authority and creates a metadata view.
   * If the metadata value does not have a valid authority, it creates a metadata view with null values.
   *
   * @param metadataValue The metadata value for which to retrieve the metadata view.
   * @returns An Observable that emits the metadata view.
   */
  private getMetadataView(metadataValue: MetadataValue): Observable<MetadataView> {
    const linksToFollow = [followLink('thumbnail')];

    if (Metadata.hasValidAuthority(metadataValue.authority)) {
      return this.itemService.findByIdWithProjections(metadataValue.authority, ['preventMetadataSecurity'], true, false, ...linksToFollow).pipe(
        getFirstCompletedRemoteData(),
        map((itemRD: RemoteData<Item>) => this.createMetadataView(itemRD, metadataValue))
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
  }

  /**
   * Creates a MetadataView object based on the provided itemRD and metadataValue.
   * @param itemRD - The RemoteData object containing the item information.
   * @param metadataValue - The MetadataValue object containing the metadata information.
   * @returns The created MetadataView object.
   */
  private createMetadataView(itemRD: RemoteData<Item>, metadataValue: MetadataValue): MetadataView {
    if (itemRD.hasSucceeded) {
      this.relatedItem = itemRD.payload;
      const entityStyleValue = this.getCrisRefMetadata(itemRD.payload?.entityType);
      return {
        authority: metadataValue.authority,
        value: metadataValue.value,
        orcidAuthenticated: this.getOrcid(itemRD.payload),
        entityType: itemRD.payload?.entityType,
        entityStyle: itemRD.payload?.firstMetadataValue(entityStyleValue)
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

  private getCrisRefMetadata(entity: string): string {
    if (isEmpty(this.crisRefMetadata)) {
      return 'cris.entity.style';
    }
    let metadata;
    if (isNotEmpty(entity)) {
      const asLowercase = entity.toLowerCase();
      metadata = this.crisRefMetadata[Object.keys(this.crisRefMetadata)
        .find(k => k.toLowerCase() === asLowercase)
        ];
    }
    return metadata ?? this.crisRefMetadata?.default;
  }

}
