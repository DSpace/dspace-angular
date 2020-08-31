import { Component, OnInit } from '@angular/core';
import { RenderingTypeModel } from '../rendering-type.model';
import { MetadataBoxFieldRendering, FieldRendetingType } from '../metadata-box.decorator';
import { ResolverStrategyService } from 'src/app/layout/services/resolver-strategy.service';
import { hasValue } from 'src/app/shared/empty.util';

/**
 * This component renders the identifier metadata fields.
 */
@Component({
  selector: 'ds-identifier',
  templateUrl: './identifier.component.html',
  styleUrls: ['./identifier.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.IDENTIFIER)
export class IdentifierComponent extends RenderingTypeModel implements OnInit {

  /**
   * value of href anchor
   */
  href: string;
  /**
   * text to show in the anchor
   */
  text: string;
  /**
   * specifies where to open the linked document
   */
  target: string;

  constructor(private resolver: ResolverStrategyService) {
    super();
    this.target = '_blank';
  }

  ngOnInit(): void {
    if ( hasValue(this.subtype) ) {
      this.composeLink(this.subtype);
    } else {
      // Check if the value is a link (http, https, ftp or ftps)
      // otherwise resolve link with managed urn
      if (this.resolver.checkLink(this.metadataValue)) {
        this.href = this.metadataValue;
        this.text = this.metadataValue;
      } else {
        for (const urn of this.resolver.managedUrn) {
          if ( hasValue(this.metadataValue) &&
            this.metadataValue.toLowerCase().startsWith(urn)) {
              this.composeLink(urn);
              break;
          }
        }
      }
    }
  }

  /**
   * Set href and text of the component based on urn
   * and metadata value
   * @param urn URN type (doi, hdl, mailto)
   */
  composeLink(urn: string): void {
    let value = this.metadataValue;
    const rep = urn + ':';
    if (this.metadataValue.startsWith(rep)) {
      value = this.metadataValue.replace(rep, '');
    }
    this.href = this.resolver.getBaseUrl(urn) + value;
    this.text = hasValue(value) && value !== '' ? value : this.href;
  }
}
