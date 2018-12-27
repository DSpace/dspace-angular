import { IntegrationModel } from './integration.model';
import { isNotEmpty } from '../../../shared/empty.util';
import { PLACEHOLDER_PARENT_METADATA } from '../../../shared/form/builder/ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';
import { OtherInformation } from '../../../shared/form/builder/models/form-field-metadata-value.model';

export class AuthorityValue extends IntegrationModel {

  id: string;

  display: string;

  value: string;

  otherInformation: OtherInformation;

  language: string;

  hasAuthority(): boolean {
    return isNotEmpty(this.id);
  }

  hasValue(): boolean {
    return isNotEmpty(this.value);
  }

  hasOtherInformation(): boolean {
    return isNotEmpty(this.otherInformation);
  }

  hasPlaceholder() {
    return this.hasValue() && this.value === PLACEHOLDER_PARENT_METADATA;
  }
}
