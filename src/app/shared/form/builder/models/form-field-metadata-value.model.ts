import { isNotEmpty } from '../../../empty.util';

export class FormFieldMetadataValueObject {
  metadata?: string;
  value: string;
  language: any;
  authority: string;
  confidence: number;
  place: number;
  closed: boolean;
  label: string;

  constructor(value: string,
              language: any = null,
              authority: string = null,
              confidence: number = -1,
              place: number = -1,
              metadata: string = null) {
    this.value = value;
    this.language = language;
    this.authority = authority;

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
}
