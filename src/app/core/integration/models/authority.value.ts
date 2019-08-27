import { IntegrationModel } from './integration.model';
import { isNotEmpty } from '../../../shared/empty.util';
import { PLACEHOLDER_PARENT_METADATA } from '../../../shared/form/builder/ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';
import { OtherInformation } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { MetadataValueInterface } from '../../shared/metadata.models';
import { ResourceType } from '../../shared/resource-type';

/**
 * Class representing an authority object
 */
export class AuthorityValue extends IntegrationModel implements MetadataValueInterface {
  static type = new ResourceType('authority');

  /**
   * The identifier of this authority
   */
  id: string;

  /**
   * The display value of this authority
   */
  display: string;

  /**
   * The value of this authority
   */
  value: string;

  /**
   * An object containing additional information related to this authority
   */
  otherInformation: OtherInformation;

  /**
   * The language code of this authority value
   */
  language: string;

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
