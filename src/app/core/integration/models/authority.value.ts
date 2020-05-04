import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { isNotEmpty } from '../../../shared/empty.util';
import { PLACEHOLDER_PARENT_METADATA } from '../../../shared/form/builder/ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';
import { OtherInformation } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { typedObject } from '../../cache/builders/build-decorators';
import { HALLink } from '../../shared/hal-link.model';
import { MetadataValueInterface } from '../../shared/metadata.models';
import { AUTHORITY_VALUE } from './authority.resource-type';
import { IntegrationModel } from './integration.model';

/**
 * Class representing an authority object
 */
@typedObject
@inheritSerialization(IntegrationModel)
export class AuthorityValue extends IntegrationModel implements MetadataValueInterface {
  static type = AUTHORITY_VALUE;

  /**
   * The identifier of this authority
   */
  @autoserialize
  id: string;

  /**
   * The display value of this authority
   */
  @autoserialize
  display: string;

  /**
   * The value of this authority
   */
  @autoserialize
  value: string;

  /**
   * An object containing additional information related to this authority
   */
  @autoserialize
  otherInformation: OtherInformation;

  /**
   * The language code of this authority value
   */
  @autoserialize
  language: string;

  /**
   * The {@link HALLink}s for this AuthorityValue
   */
  @deserialize
  _links: {
    self: HALLink,
  };

  /**
   * This method checks if authority has an identifier value
   *
   * @return boolean
   */
  hasAuthority(): boolean {
    return isNotEmpty(this.id);
  }

  /**
   * This method checks if authority has a value
   *
   * @return boolean
   */
  hasValue(): boolean {
    return isNotEmpty(this.value);
  }

  /**
   * This method checks if authority has related information object
   *
   * @return boolean
   */
  hasOtherInformation(): boolean {
    return isNotEmpty(this.otherInformation);
  }

  /**
   * This method checks if authority has a placeholder as value
   *
   * @return boolean
   */
  hasPlaceholder(): boolean {
    return this.hasValue() && this.value === PLACEHOLDER_PARENT_METADATA;
  }
}
