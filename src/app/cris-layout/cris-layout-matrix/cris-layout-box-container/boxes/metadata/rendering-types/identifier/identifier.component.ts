import { IdentifierSubtypesConfig, IdentifierSubtypesIconPositionEnum } from './../../../../../../../../config/identifier-subtypes-config.interface';
import { Component, Inject, OnInit } from '@angular/core';
import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { ResolverStrategyService } from '../../../../../../services/resolver-strategy.service';
import { hasNoValue, hasValue, isNotEmpty } from '../../../../../../../shared/empty.util';
import { MetadataLinkValue } from '../../../../../../models/cris-layout-metadata-link-value.model';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { TranslateService } from '@ngx-translate/core';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { MetadataValue } from '../../../../../../../core/shared/metadata.models';
import { environment } from 'src/environments/environment';

/**
 * This component renders the identifier metadata fields.
 */
@Component({
  selector: 'ds-identifier',
  templateUrl: './identifier.component.html',
  styleUrls: ['./identifier.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.IDENTIFIER)
export class IdentifierComponent extends RenderingTypeValueModelComponent implements OnInit {

  /**
   * The identifier to render
   */
  identifier: MetadataLinkValue;
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

  /**
   * The identifier subtype configurations
   */
  identifierSubtypeConfig: IdentifierSubtypesConfig[] = environment.identifierSubtypes;

  /**
   * The icon to display for the identifier subtype
   */
  subTypeIcon: string;

  /**
   * The position of the icon relative to the identifier
   */
  iconPosition: IdentifierSubtypesIconPositionEnum = IdentifierSubtypesIconPositionEnum.NONE;

  /**
   * The link to navigate to when the icon is clicked
   */
  iconLink = '';

  /**
   * The identifier subtype to render
   */
  iconPositionEnum = IdentifierSubtypesIconPositionEnum;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('metadataValueProvider') public metadataValueProvider: MetadataValue,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected resolver: ResolverStrategyService,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, metadataValueProvider, renderingSubTypeProvider, tabNameProvider, translateService);
  }

  getIdentifierFromValue() {
    let identifier: MetadataLinkValue;
    if (isNotEmpty(this.renderingSubType)) {
      identifier = this.composeLink(this.metadataValue.value, this.renderingSubType);
    } else {
      // Check if the value is a link (http, https, ftp or ftps)
      // otherwise resolve link with managed urn
      if (this.resolver.checkLink(this.metadataValue.value)) {
        identifier = {
          href: this.metadataValue.value,
          text: this.metadataValue.value
        };
      } else {
        for (const urn of this.resolver.managedUrn) {
          if (hasValue(this.metadataValue.value) && this.metadataValue.value.toLowerCase().startsWith(urn)) {
            identifier = this.composeLink(this.metadataValue.value, urn);
            break;
          }
        }
        if (!identifier) {
          identifier = {
            href: this.metadataValue.value,
            text: this.metadataValue.value
          };
        }
      }
    }

    return identifier;
  }

  /**
   * Create a MetadataLinkValue object with the given href and text
   * @param href the href value
   * @param text the text value
   * @returns MetadataLinkValue object
   */
  private createMetadataLinkValue(href: string, text: string): MetadataLinkValue {
    text = text.trim() !== '' ? text : href;
    return { href, text };
  }

  /**
   * Set href and text of the component based on urn
   * and the given metadata value.
   * Is handling the case when the urn is configured in the default-app-config
   * and the link is pre-configured.
   * @param metadataValue the metadata value
   * @param urn URN type (doi, hdl, mailto)
   */
  composeLink(metadataValue: string, urn: string): MetadataLinkValue {
    const subtypeValue = this.getIdentifierSubtypeValue();

    if (hasValue(subtypeValue)) {
      const href = this.validateLink(metadataValue) ? metadataValue : `${subtypeValue.link}/${metadataValue}`;
      return this.createMetadataLinkValue(href, metadataValue);
    }

    let value = metadataValue;
    const rep = `${urn}:`;
    if (metadataValue.startsWith(rep)) {
      value = metadataValue.replace(rep, '');
    }
    const shouldKeepWhiteSpaces = environment.crisLayout
      .urn?.find((urnConfig) => urnConfig.name === urn)?.shouldKeepWhiteSpaces;
    const href = this.resolver.getBaseUrl(urn) + (shouldKeepWhiteSpaces ? value : value.replace(/\s/g, ''));
    return this.createMetadataLinkValue(href, value);
  }

  ngOnInit(): void {
    this.identifier = this.getIdentifierFromValue();
    this.setIconDetails();
  }

  /**
   * Sets the icon details based on the identifier subtype configuration.
   * If the identifier subtype is not empty, it searches for the subtype with a matching name to the rendering subtype.
   * If a matching subtype is found, it sets the icon position, subtype icon, and icon link based on the subtype's properties.
   */
  private setIconDetails() {
    const subtypeVal = this.getIdentifierSubtypeValue();
    if (hasNoValue(subtypeVal)) {
      return;
    }
    this.iconPosition = subtypeVal.iconPosition;
    this.subTypeIcon = subtypeVal.iconPosition !== IdentifierSubtypesIconPositionEnum.NONE ? subtypeVal?.icon : '';
    this.iconLink = subtypeVal?.link;
  }

  /**
   * Retrieves the value of the identifier subtype configuration based on the rendering subtype.
   * @returns The identifier subtype configuration object.
   */
  private getIdentifierSubtypeValue(): IdentifierSubtypesConfig {
    if (isNotEmpty(this.identifierSubtypeConfig)) {
      const subtypeVal = this.identifierSubtypeConfig.find((subtype) => subtype.name === this.renderingSubType);
      return subtypeVal;
    }
  }

  /**
   * Check if the given link is valid
   * @param link the link to check
   * @returns true if the link is valid, false otherwise
   */
  private validateLink(link: string): boolean {
    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    return urlRegex.test(link);
  }
}


