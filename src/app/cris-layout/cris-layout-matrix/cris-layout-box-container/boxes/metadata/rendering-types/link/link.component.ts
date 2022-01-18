import { Component, Inject, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { hasValue } from '../../../../../../../shared/empty.util';
import { MetadataLinkValue } from '../../../../../../models/cris-layout-metadata-link-value.model';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';

/**
 * Defines the list of subtypes for this rendering
 */
enum TYPES {
  LABEL = 'LABEL'
}

/**
 * This component renders the links metadata fields.
 * The metadata value is used for href and text
 */
@Component({
  // tslint:disable-next-line: component-selector
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

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('metadataValueProvider') public metadataValueProvider: any,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, metadataValueProvider, renderingSubTypeProvider, translateService);
  }

  ngOnInit(): void {
    this.link = this.getLinkFromValue();
  }

  /**
   * Get the link value to render
   */
  getLinkFromValue(): MetadataLinkValue {
    // If the component has label subtype get the text from translate service
    const linkText = (hasValue(this.renderingSubType) &&
      this.renderingSubType.toUpperCase() === TYPES.LABEL) ? this.translateService.instant(this.field.label) : this.metadataValue.value;

    return {
      href: this.metadataValue.value,
      text: linkText
    };
  }
}
