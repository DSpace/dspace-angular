import { Operation } from 'fast-json-patch';
import { hasValue } from '../../../../shared/empty.util';

/**
 * Wrapper object for metadata patch Operations
 * It contains the operation type, metadata field, metadata place and patch value, as well as a method to transform it
 * into a fast-json-patch Operation.
 */
export class MetadataPatchOperation {
  op: string;
  field: string;
  place: number;
  value: any;

  constructor(op: string, field: string, place?: number, value?: any) {
    this.op = op;
    this.field = field;
    this.place = place;
    this.value = value;
  }

  /**
   * Transform the MetadataPatchOperation into a fast-json-patch Operation by constructing its path and other properties
   * using the information provided.
   */
  toOperation(): Operation {
    let path = `/metadata/${this.field}`;
    if (hasValue(this.place)) {
      path += `/${this.place}`;
    }
    return { op: this.op as any, path, value: this.value };
  }
}
