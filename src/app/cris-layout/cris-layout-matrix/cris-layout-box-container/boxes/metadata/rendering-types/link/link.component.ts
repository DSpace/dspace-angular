import { Component, Inject, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { hasValue } from '../../../../../../../shared/empty.util';
import { MetadataLinkValue } from '../../../../../../models/cris-layout-metadata-link-value.model';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { MetadataValue } from '../../../../../../../core/shared/metadata.models';

/**
 * Defines the list of subtypes for this rendering
 */
enum TYPES {
  LABEL = 'LABEL',
  EMAIL = 'EMAIL'
}

/**
 * This component renders the links metadata fields.
 * The metadata value is used for href and text
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-link]',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.LINK)
export class LinkComponent extends RenderingTypeValueModelComponent implements OnInit {

  /**
   * The link to render
   */
  link: MetadataLinkValue;

  isEmail = false;

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
  }

  /**
   * Get the link value to render
   */
  getLinkFromValue(): MetadataLinkValue {
    // If the component has label subtype get the text from translate service
    let linkText: string;
    let metadataValue: string;

    if (hasValue(this.renderingSubType) && this.renderingSubType.toUpperCase() === TYPES.EMAIL) {
        this.isEmail = true;
        metadataValue = 'mailto:' + this.metadataValue.value;
        linkText = (hasValue(this.renderingSubType) &&
        this.renderingSubType.toUpperCase() === TYPES.EMAIL) ? this.metadataValue.value : this.translateService.instant(this.field.label);
    } else {
        const startsWithProtocol = [/^https?:\/\//, /^ftp:\/\//];
        metadataValue = startsWithProtocol.some(rx => rx.test(this.metadataValue.value)) ? this.metadataValue.value : 'http://' + this.metadataValue.value;
        linkText = (hasValue(this.renderingSubType) &&
        this.renderingSubType.toUpperCase() === TYPES.LABEL) ? this.translateService.instant(this.field.label) : this.metadataValue.value;
    }

    return {
      href: metadataValue,
      text: linkText
    };
  }
}
