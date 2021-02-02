import { Component, OnInit } from '@angular/core';

import { RenderingTypeModelComponent } from '../rendering-type.model';
import { FieldRendetingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { ResolverStrategyService } from '../../../../services/resolver-strategy.service';
import { hasValue } from '../../../../../shared/empty.util';
import { MetadataLinkValue } from '../../../../models/cris-layout-metadata-link-value.model';

/**
 * This component renders the identifier metadata fields.
 */
@Component({
  selector: 'ds-identifier',
  templateUrl: './identifier.component.html',
  styleUrls: ['./identifier.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.IDENTIFIER)
export class IdentifierComponent extends RenderingTypeModelComponent implements OnInit {

  /**
   * list of identifier values
   */
  identifiers: MetadataLinkValue[];
  /**
   * value of href anchor
   */
  href: string[];
  /**
   * text to show in the anchor
   */
  text: string[];
  /**
   * specifies where to open the linked document
   */
  target = '_blank';

  constructor(private resolver: ResolverStrategyService) {
    super();
  }

  ngOnInit(): void {
    const identifiers = [];
    this.metadataValues.forEach((metadataValue) => {
      let identifier: MetadataLinkValue;
      if ( hasValue(this.subtype) ) {
        identifier = this.composeLink(metadataValue, this.subtype);
      } else {
        // Check if the value is a link (http, https, ftp or ftps)
        // otherwise resolve link with managed urn
        if (this.resolver.checkLink(metadataValue)) {
          identifier = {
            href: metadataValue,
            text: metadataValue
          };
        } else {
          for (const urn of this.resolver.managedUrn) {
            if (hasValue(metadataValue) && metadataValue.toLowerCase().startsWith(urn)) {
              identifier = this.composeLink(metadataValue, urn);
              break;
            }
          }
        }
      }
      identifiers.push(identifier);
    });
    this.identifiers = identifiers;
  }

  /**
   * Set href and text of the component based on urn
   * and the given metadata value
   * @param metadataValue the metadata value
   * @param urn URN type (doi, hdl, mailto)
   */
  composeLink(metadataValue: string, urn: string): MetadataLinkValue {
    let value = metadataValue;
    const rep = urn + ':';
    if (metadataValue.startsWith(rep)) {
      value = metadataValue.replace(rep, '');
    }
    const href = this.resolver.getBaseUrl(urn) + value;
    const text = hasValue(value) && value !== '' ? value : href;
    return {
      href,
      text
    };
  }
}
