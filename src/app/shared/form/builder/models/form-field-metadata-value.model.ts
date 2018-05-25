import { isNotEmpty } from '../../../empty.util';

export class FormFieldMetadataValueObject {
  metadata?: string;
  value: string;
  display: string;
  language: any;
  authority: string;
  confidence: number;
  place: number;
  closed: boolean;
  label: string;

  constructor(value: string = null,
              language: any = null,
              authority: string = null,
              display: string = null,
              place: number = 0,
              confidence: number = -1,
              metadata: string = null) {
    this.value = value;
    this.language = language;
    this.authority = authority;
    this.display = display || value;

    this.confidence = confidence;
    if (authority != null) {
      this.confidence = 600;
    } else if (isNotEmpty(confidence)) {
      this.confidence = confidence;
    }

    this.place = place;
    if (isNotEmpty(metadata)) {
      this.metadata = metadata;
    }
  }

  hasAuthority(): boolean {
    return isNotEmpty(this.authority);
  }

  hasValue(): boolean {
    return isNotEmpty(this.value);
  }
}
