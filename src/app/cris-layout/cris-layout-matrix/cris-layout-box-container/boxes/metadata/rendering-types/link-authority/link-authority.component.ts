import { Component, Inject, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { MetadataLinkValue } from '../../../../../../models/cris-layout-metadata-link-value.model';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { MetadataValue } from '../../../../../../../core/shared/metadata.models';
import { isEmpty } from '../../../../../../../shared/empty.util';

/**
 * This component renders the links metadata fields.
 * The metadata value is used for href and text
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-link-authority]',
  templateUrl: './link-authority.component.html',
  styleUrls: ['./link-authority.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.AUTHORITYLINK)
export class LinkAuthorityComponent extends RenderingTypeValueModelComponent implements OnInit {

  /**
   * The link to render
   */
  link: MetadataLinkValue;
  iconStyle: string;


  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('metadataValueProvider') public metadataValueProvider: MetadataValue,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected translateService: TranslateService
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
      text: this.metadataValue.value
    };
  }

  getWebsiteIcon(): string {
    let iconStyle = '';
    const siteUrl = this.metadataValue.authority;
    if (isEmpty(siteUrl)) {
      return iconStyle;
    }

    if (siteUrl.includes('linkedin')) {
      iconStyle = 'fab fa-linkedin';
    } else if (siteUrl.includes('twitter')) {
      iconStyle = 'fa-brands fa-x-twitter';
    } else if (siteUrl.includes('instagram')) {
      iconStyle = 'fab fa-instagram';
    } else if (siteUrl.includes('facebook')) {
      iconStyle = 'fab fa-facebook';
    }
    return iconStyle;
  }
}
