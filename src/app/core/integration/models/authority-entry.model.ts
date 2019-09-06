import { IntegrationModel } from './integration.model';
import { isNotEmpty } from '../../../shared/empty.util';
import { PLACEHOLDER_PARENT_METADATA } from '../../../shared/form/builder/ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';
import { OtherInformation } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { MetadataValueInterface } from '../../shared/metadata.models';
import { ResourceType } from '../../shared/resource-type';

/**
 * Class representing an authority object
 */
export class AuthorityEntry extends IntegrationModel implements MetadataValueInterface {
  static type = new ResourceType('authorityEntry');

  /**
   * The identifier of this authority entry
   */
  id: string;

  /**
   * The display value of this authority entry
   */
  display: string;

  /**
   * The value of this authority entry
   */
  value: string;

  /**
   * An object containing additional information related to this authority entry
   */
  otherInformation: OtherInformation;

  /**
   * The language code of this authority value
   */
  language: string;

  /**
   * True if the Authority entry is selectable
   */
  selectable: boolean;

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
