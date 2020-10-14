import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { FieldRendetingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeModel } from '../rendering-type.model';
import { hasValue } from '../../../../../shared/empty.util';
import { MetadataLinkValue } from '../../../../models/cris-layout-metadata-link-value.model';

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
@MetadataBoxFieldRendering(FieldRendetingType.LINK)
export class LinkComponent extends RenderingTypeModel implements OnInit {

  /**
   * list of identifier values
   */
  links: MetadataLinkValue[] = [];

  constructor(private translateService: TranslateService) {
    super();
  }

  ngOnInit(): void {
    const links = [];
    this.metadataValues.forEach((metadataValue) => {
      // If the component has label subtype get the text from translate service
      const linkText = (hasValue(this.subtype) &&
        this.subtype.toUpperCase() === TYPES.LABEL) ? this.translateService.instant(this.label) : metadataValue
      const link = {
        href: metadataValue,
        text: linkText
      };
      links.push(link);
    })
    this.links = links;
  }

}
