import { IdentifierSubtypesConfig } from './../../../../config/identifier-subtypes-config.interface';
import { MetadataLinkViewPopoverDataConfig } from 'src/config/metadata-link-view-popoverdata-config.interface';
import { Item } from './../../../core/shared/item.model';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { hasNoValue, hasValue } from '../../empty.util';

import { AuthorithyIcon } from 'src/config/submission-config.interface';
import { getItemPageRoute } from 'src/app/item-page/item-page-routing-paths';

@Component({
  selector: 'ds-metadata-link-view-popover',
  templateUrl: './metadata-link-view-popover.component.html',
  styleUrls: ['./metadata-link-view-popover.component.scss']
})
export class MetadataLinkViewPopoverComponent implements OnInit {

  /**
   * The item to display the metadata for
   */
  @Input() item: Item;

  /**
   * The metadata link view popover data configuration.
   * This configuration is used to determine which metadata fields to display for the given entity type
   */
  metadataLinkViewPopoverData: MetadataLinkViewPopoverDataConfig = environment.metadataLinkViewPopoverData;

  /**
   * The metadata fields to display for the given entity type
   */
  entityMetdataFields: string[] = [];

  /**
   * The metadata fields including long text metadata values.
   * These metadata values should be truncated to a certain length.
   */
  longTextMetadataList = ['dc.description.abstract', 'dc.description'];

  /**
   * The source icons configuration
   */
  sourceIcons: AuthorithyIcon[] = environment.submission.icons.authority.sourceIcons;

  /**
   * The identifier subtype configurations
   */
  identifierSubtypeConfig: IdentifierSubtypesConfig[] = environment.identifierSubtypes;

  /**
   * Whether the entity type is not found in the metadataLinkViewPopoverData configuration
   */
  isOtherEntityType = false;

  /**
   * If `metadataLinkViewPopoverData` is provided, it retrieves the metadata fields based on the entity type.
   * If no metadata fields are found for the entity type, it falls back to the fallback metadata list.
   */
  ngOnInit() {
    if (this.metadataLinkViewPopoverData) {
      const metadataFields = this.metadataLinkViewPopoverData.entityDataConfig.find((config) => config.entityType === this.item.entityType);
      this.entityMetdataFields = hasValue(metadataFields) ? metadataFields.metadataList : this.metadataLinkViewPopoverData.fallbackMetdataList;
      this.isOtherEntityType = hasNoValue(metadataFields);
    }
  }

  /**
   * Checks if the given metadata value is a valid link.
   */
  isLink(metadataValue: string): boolean {
    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    return urlRegex.test(metadataValue);
  }

  /**
   * Returns the page route for the item.
   * @returns The page route for the item.
   */
  getItemPageRoute(): string {
   return getItemPageRoute(this.item);
  }

  /**
   * Retrieves the identifier subtype configuration based on the given metadata value.
   * @param metadataValue - The metadata value used to determine the identifier subtype.
   * @returns The identifier subtype configuration object.
   */
  getSourceSubTypeIdentifier(metadataValue: string): IdentifierSubtypesConfig {
    const metadataValueSplited = metadataValue.split('.');
    const subtype = metadataValueSplited[metadataValueSplited.length - 1];
    const identifierSubtype = this.identifierSubtypeConfig.find((config) => config.name === subtype);
    return identifierSubtype;
  }
}
