import { MetadataMap, MetadataValue } from '../../core/shared/metadata.models';
import { hasNoValue, hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';

export enum DsoEditMetadataChangeType {
  UPDATE = 1,
  ADD = 2,
  REMOVE = 3
}

export class DsoEditMetadataValue {
  originalValue: MetadataValue;
  newValue: MetadataValue;
  reinstatableValue: MetadataValue;

  editing = false;
  change: DsoEditMetadataChangeType;
  reinstatableChange: DsoEditMetadataChangeType;

  constructor(value: MetadataValue, added = false) {
    this.originalValue = value;
    this.newValue = Object.assign(new MetadataValue(), value);
    if (added) {
      this.change = DsoEditMetadataChangeType.ADD;
      this.editing = true;
    }
  }

  confirmChanges() {
    if (hasNoValue(this.change) || this.change === DsoEditMetadataChangeType.UPDATE) {
      if ((this.originalValue.value !== this.newValue.value || this.originalValue.language !== this.newValue.language)) {
        this.change = DsoEditMetadataChangeType.UPDATE;
      } else {
        this.change = undefined;
      }
    }
    this.editing = false;
  }

  hasChanges(): boolean {
    return hasValue(this.change);
  }

  discardAndMarkReinstatable(): void {
    if (this.change === DsoEditMetadataChangeType.UPDATE) {
      this.reinstatableValue = this.newValue;
    }
    this.reinstatableChange = this.change;
    this.discard();
  }

  discard(): void {
    this.change = undefined;
    this.newValue = Object.assign(new MetadataValue(), this.originalValue);
    this.editing = false;
  }

  reinstate(): void {
    this.newValue = this.reinstatableValue;
    this.reinstatableValue = undefined;
    this.change = this.reinstatableChange;
    this.reinstatableChange = undefined;
  }

  isReinstatable(): boolean {
    return hasValue(this.reinstatableValue) || hasValue(this.reinstatableChange);
  }
}

export class DsoEditMetadataForm {
  fieldKeys: string[];
  fields: {
    [mdField: string]: DsoEditMetadataValue[],
  };
  newValue: DsoEditMetadataValue;

  constructor(metadata: MetadataMap) {
    this.fieldKeys = [];
    this.fields = {};
    Object.entries(metadata).forEach(([mdField, values]: [string, MetadataValue[]]) => {
      this.fieldKeys.push(mdField);
      this.fields[mdField] = values.map((value) => new DsoEditMetadataValue(value));
    });
  }

  add(): void {
    if (hasNoValue(this.newValue)) {
      this.newValue = new DsoEditMetadataValue(new MetadataValue(), true);
    }
  }

  setMetadataField(mdField: string) {
    if (isEmpty(this.fields[mdField])) {
      this.fieldKeys.push(mdField);
      this.fields[mdField] = [];
    }
    this.fields[mdField].push(this.newValue);
    this.newValue = undefined;
  }

  remove(mdField: string, index: number) {
    if (isNotEmpty(this.fields[mdField])) {
      this.fields[mdField].splice(index, 1);
      if (this.fields[mdField].length === 0) {
        this.fieldKeys.splice(this.fieldKeys.indexOf(mdField), 1);
        delete this.fields[mdField];
      }
    }
  }

  hasChanges(): boolean {
    return Object.values(this.fields).some((values) => values.some((value) => value.hasChanges()));
  }

  discard(): void {
    Object.values(this.fields).forEach((values) => {
      values.forEach((value) => {
        value.discard();
      });
    });
  }

  reinstate(): void {
    Object.values(this.fields).forEach((values) => {
      values.forEach((value) => {
        value.reinstate();
      });
    });
  }

  isReinstatable(): boolean {
    return Object.values(this.fields).some((values) => values.some((value) => value.isReinstatable()));
  }
}
