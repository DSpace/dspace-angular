import { NgClass } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { LayoutField } from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import { isEmpty } from '@dspace/shared/utils/empty.util';
import { TranslateService } from '@ngx-translate/core';

import MetadataValue from '../../../../../../../core/shared/metadata.models';
import { MetadataLinkValue } from '../../../../../../models/dynamic-layout-metadata-link-value.model';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';

/**
 * This component renders the links metadata fields.
 * The metadata value is used for href and text
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-link-authority]',
  templateUrl: './link-authority.component.html',
  styleUrls: ['./link-authority.component.scss'],
  imports: [
    NgClass,
  ],
})
export class LinkAuthorityComponent extends RenderingTypeValueModelComponent implements OnInit {

  /**
   * The link to render
   */
  link: MetadataLinkValue;
  iconStyle: string;

  defaultIcon = 'fa fa-external-link-square';


  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('metadataValueProvider') public metadataValueProvider: MetadataValue,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected translateService: TranslateService,
  ) {
    super(fieldProvider, itemProvider, metadataValueProvider, renderingSubTypeProvider, tabNameProvider, translateService);
  }

  ngOnInit(): void {
    this.link = this.getLinkFromValue();
    this.iconStyle = this.getWebsiteIcon();
  }

  /**
   * Get the link value to render
   */
  getLinkFromValue(): MetadataLinkValue {
    return {
      href: this.metadataValue.authority,
      text: this.metadataValue.value,
    };
  }

  getWebsiteIcon(): string {
    let iconStyle = '';
    const siteUrl = this.metadataValue.authority;
    if (isEmpty(siteUrl)) {
      return iconStyle;
    }

    const hostname = new URL(siteUrl)?.hostname?.replace(/^www\./, '') ||
      siteUrl.toLowerCase();

    if (/^(linkedin\.com|lnkd\.in)$/.test(hostname)) {
      iconStyle = 'fab fa-linkedin';
    } else if (/^(twitter\.com|x\.com|t\.co)$/.test(hostname)) {
      iconStyle = 'fa-brands fa-x-twitter';
    } else if (/^(instagram\.com|instagr\.am)$/.test(hostname)) {
      iconStyle = 'fab fa-instagram';
    } else if (/^(facebook\.com|fb\.com)$/.test(hostname)) {
      iconStyle = 'fab fa-facebook';
    }
    return iconStyle;
  }
}
