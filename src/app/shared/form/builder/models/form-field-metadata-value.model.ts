import { hasValue, isEmpty, isNotEmpty, isNotNull } from '../../../empty.util';
import { ConfidenceType } from '../../../../core/integration/models/confidence-type';
import { PLACEHOLDER_PARENT_METADATA } from '../ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';
import { MetadataValueInterface, VIRTUAL_METADATA_PREFIX } from '../../../../core/shared/metadata.models';

export interface OtherInformation {
  [name: string]: string
}

export class FormFieldMetadataValueObject implements MetadataValueInterface {
  metadata?: string;
  value: any;
  display: string;
  language: any;
  authority: string;
  confidence: ConfidenceType;
  place: number;
  closed: boolean;
  label: string;
  otherInformation: OtherInformation;

  constructor(value: any = null,
              language: any = null,
              authority: string = null,
              display: string = null,
              place: number = 0,
              confidence: number = null,
              otherInformation: any = null,
              metadata: string = null) {
    this.value = isNotNull(value) ? ((typeof value === 'string') ? value.trim() : value) : null;
    this.language = language;
    this.authority = authority;
    this.display = display || value;

    this.confidence = confidence;
    if (authority != null && isEmpty(confidence)) {
      this.confidence = ConfidenceType.CF_ACCEPTED;
    } else if (isNotEmpty(confidence)) {
      this.confidence = confidence;
    } else {
      this.confidence = ConfidenceType.CF_UNSET;
    }

    this.place = place;
    if (isNotEmpty(metadata)) {
      this.metadata = metadata;
    }

    this.otherInformation = otherInformation;
  }

  hasAuthority(): boolean {
    return isNotEmpty(this.authority);
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

  get isVirtual(): boolean {
    return hasValue(this.authority) && this.authority.startsWith(VIRTUAL_METADATA_PREFIX);
  }

  toString() {
    return this.display || this.value;
  }
}
