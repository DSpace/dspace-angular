import { IntegrationModel } from './integration.model';
import { autoserialize } from 'cerialize';
import { isNotEmpty } from '../../../shared/empty.util';
import { PLACEHOLDER_PARENT_METADATA } from '../../../shared/form/builder/ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';

export class AuthorityValue extends IntegrationModel {

  @autoserialize
  id: string;

  @autoserialize
  display: string;

  @autoserialize
  value: string;

  @autoserialize
  otherInformation: any;

  @autoserialize
  language: string;

  @autoserialize
  hasAuthority(): boolean {
    return isNotEmpty(this.id);
  }

  @autoserialize
  hasValue(): boolean {
    return isNotEmpty(this.value);
  }

  @autoserialize
  hasOtherInformation(): boolean {
    return isNotEmpty(this.otherInformation);
  }

  @autoserialize
  hasPlaceholder() {
    return this.hasValue() && this.value === PLACEHOLDER_PARENT_METADATA;
  }
}
