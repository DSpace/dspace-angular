import {
  AsyncPipe,
  NgOptimizedImage,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { IdentifierSubtypesConfig } from '@dspace/config/identifier-subtypes-config.interface';
import { MetadataLinkViewPopoverDataConfig } from '@dspace/config/metadata-link-view-popoverdata-config.interface';
import { getItemPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import { Item } from '@dspace/core/shared/item.model';
import {
  hasNoValue,
  hasValue,
} from '@dspace/shared/utils/empty.util';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AuthorithyIcon } from 'src/config/submission-config.interface';
import { environment } from 'src/environments/environment';

import { VarDirective } from '../../utils/var.directive';
import { MetadataLinkViewAvatarPopoverComponent } from '../metadata-link-view-avatar-popover/metadata-link-view-avatar-popover.component';
import { MetadataLinkViewOrcidComponent } from '../metadata-link-view-orcid/metadata-link-view-orcid.component';


@Component({
  selector: 'ds-metadata-link-view-popover',
  templateUrl: './metadata-link-view-popover.component.html',
  styleUrls: ['./metadata-link-view-popover.component.scss'],
  imports: [
    AsyncPipe,
    MetadataLinkViewAvatarPopoverComponent,
    MetadataLinkViewOrcidComponent,
    NgbTooltipModule,
    NgOptimizedImage,
    RouterLink,
    TranslateModule,
    VarDirective,
  ],
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
   * The title to be displayed
   */
  title: string;

  private readonly titleSeparator = ', ';
  private readonly defaultTitleMetadataList = ['dc.title'];

  /**
   * If `metadataLinkViewPopoverData` is provided, it retrieves the metadata fields based on the entity type.
   * If no metadata fields are found for the entity type, it falls back to the fallback metadata list.
   */
  ngOnInit() {
    if (this.metadataLinkViewPopoverData) {
      const metadataFields = this.metadataLinkViewPopoverData.entityDataConfig.find((config) => config.entityType === this.item.entityType);
      this.entityMetdataFields = hasValue(metadataFields) ? metadataFields.metadataList : this.metadataLinkViewPopoverData.fallbackMetdataList;
      this.isOtherEntityType = hasNoValue(metadataFields);
      this.title = this.getTitleFromMetadataList();
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

  /**
   * Generates the title for the popover based on the title metadata list.
   * @returns The generated title as a string.
   */
  getTitleFromMetadataList(): string {
    const titleMetadataList = this.metadataLinkViewPopoverData.entityDataConfig.find((config) => config.entityType === this.item.entityType)?.titleMetadataList;
    const itemHasConfiguredTitle = titleMetadataList?.length && titleMetadataList.map(metadata => this.item.firstMetadataValue(metadata)).some(value => hasValue(value));
    return (itemHasConfiguredTitle ? titleMetadataList : this.defaultTitleMetadataList)
      .map(metadataField => this.item.firstMetadataValue(metadataField)).join(this.titleSeparator);
  }
}
