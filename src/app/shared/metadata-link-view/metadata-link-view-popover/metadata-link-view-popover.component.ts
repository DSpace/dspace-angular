import { MetadataLinkViewPopoverDataConfig } from 'src/config/metadata-link-view-popoverdata-config.interface';
import { Item } from './../../../core/shared/item.model';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { hasNoValue, hasValue } from '../../empty.util';
import { MetadataView } from '../metadata-view.model';

import { AuthorithyIcon } from 'src/config/submission-config.interface';
import { getItemPageRoute } from 'src/app/item-page/item-page-routing-paths';

@Component({
  selector: 'ds-metadata-link-view-popover',
  templateUrl: './metadata-link-view-popover.component.html',
  styleUrls: ['./metadata-link-view-popover.component.scss']
})
export class MetadataLinkViewPopoverComponent implements OnInit {

  @Input() item: Item;

  @Input() metadataView: MetadataView;

  metadataLinkViewPopoverData: MetadataLinkViewPopoverDataConfig = environment.metadataLinkViewPopoverData;

  entityMetdataFields: string[] = [];

  longTextMetadataList = ['dc.description.abstract', 'dc.description'];

  showIconMetadataList = ['organization.identifier.ror'];

  sourceIcons: AuthorithyIcon[] = environment.submission.icons.authority.sourceIcons;

  isOtherEntityType = false;

  ngOnInit() {
    if (this.metadataLinkViewPopoverData) {
      const metadataFields = this.metadataLinkViewPopoverData.entityDataConfig.find((config) => config.entityType === this.item.entityType);
      this.entityMetdataFields = hasValue(metadataFields) ? metadataFields.metadataList : this.metadataLinkViewPopoverData.fallbackMetdataList;
      this.isOtherEntityType = hasNoValue(metadataFields);
    }
  }

  isLink(metadataValue: string): boolean {
    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    return urlRegex.test(metadataValue);
  }

  getSourceIconPath(metadataValue: string): string {
    const icon = this.sourceIcons.find((i) => i.source.toLowerCase() === metadataValue.toLowerCase());
    return hasValue(icon) ? icon.path : '';
  }

  getItemPageRoute(): string {
   return getItemPageRoute(this.item);
  }
}
