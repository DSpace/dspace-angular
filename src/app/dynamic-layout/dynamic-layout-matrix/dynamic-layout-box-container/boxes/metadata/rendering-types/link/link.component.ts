import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { LayoutField } from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { TranslateService } from '@ngx-translate/core';

import MetadataValue from '../../../../../../../core/shared/metadata.models';
import { MetadataLinkValue } from '../../../../../../models/dynamic-layout-metadata-link-value.model';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';

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
  styleUrls: ['./link.component.scss'],
})
export class LinkComponent extends RenderingTypeValueModelComponent implements OnInit {

  /**
   * The link to render
   */
  link: MetadataLinkValue;

  /**
   * Flag to determine if the value is a valid URL
   */
  isLink = false;

  isEmail = false;

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
    this.isLink = this.isValidUrl();
    this.link = this.getLinkFromValue();
  }

  /**
   * Check if the metadata value is a valid URL
   */
  isValidUrl(): boolean {
    let value = this.metadataValue.value.trim();

    // If the subtype is LABEL, the value is in [Label](URL) format — extract the URL part
    if (hasValue(this.renderingSubType) && this.renderingSubType.toUpperCase() === TYPES.LABEL.toString()) {
      const parsed = this.parseLabelValue(value);
      value = parsed.value;
    }
    // Comprehensive URL regex that matches:
    // - URLs with protocols (http, https, ftp, mailto, etc.)
    // - URLs without protocols (www.example.com, example.com)
    // - URLs with paths, query strings, and fragments
    const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

    return urlRegex.test(value);
  }

  /**
   * Get the link value to render
   */
  getLinkFromValue(): MetadataLinkValue {
    // If the component has label subtype get the text from translate service
    let linkText: string;
    let metadataValue: string;

    if (hasValue(this.renderingSubType) && this.renderingSubType.toUpperCase() === TYPES.EMAIL.toString()) {
      this.isEmail = true;
      metadataValue = 'mailto:' + this.metadataValue.value;
      linkText = (hasValue(this.renderingSubType) &&
        this.renderingSubType.toUpperCase() === TYPES.EMAIL.toString()) ? this.metadataValue.value : this.translateService.instant(this.field.label);
    } else if ((hasValue(this.renderingSubType) && this.renderingSubType.toUpperCase() === TYPES.LABEL.toString())) {
      // Parse value in format [Label](URL)
      const parsedValue = this.parseLabelValue(this.metadataValue.value);

      metadataValue = this.getLinkWithProtocol(parsedValue.value);
      linkText = parsedValue.label;
    } else {
      // Use same value for link and label, correcting the protocol for link if needed
      metadataValue = this.getLinkWithProtocol(this.metadataValue.value);
      linkText = this.metadataValue.value;
    }

    return {
      href: metadataValue,
      text: linkText,
    };
  }

  /**
   * Exctract label and values for TYPES.LABEL
   * @param value
   */
  parseLabelValue(input: string): { label: string; value: string } {
    const match = input.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

    if (!match) {
      return {
        label: input,
        value: input,
      };
    }

    return {
      label: match[1],
      value: match[2],
    };
  }

  getLinkWithProtocol(link: string): string {
    const startsWithProtocol = [/^https?:\/\//, /^ftp:\/\//];
    return  startsWithProtocol.some(rx => rx.test(link)) ? link : 'http://' + link;
  }
}
