import { MetadataMap, MetadataValue } from '../../core/shared/metadata.models';
import { hasNoValue, hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { Operation } from 'fast-json-patch';
import { MetadataPatchReplaceOperation } from '../../core/data/object-updates/patch-operation-service/operations/metadata/metadata-patch-replace-operation.model';
import { MetadataPatchRemoveOperation } from '../../core/data/object-updates/patch-operation-service/operations/metadata/metadata-patch-remove-operation.model';
import { MetadataPatchAddOperation } from '../../core/data/object-updates/patch-operation-service/operations/metadata/metadata-patch-add-operation.model';
import { MetadataPatchOperation } from '../../core/data/object-updates/patch-operation-service/operations/metadata/metadata-patch-operation.model';

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
    if (hasValue(this.reinstatableValue)) {
      this.newValue = this.reinstatableValue;
      this.reinstatableValue = undefined;
    }
    if (hasValue(this.reinstatableChange)) {
      this.change = this.reinstatableChange;
      this.reinstatableChange = undefined;
    }
  }

  isReinstatable(): boolean {
    return hasValue(this.reinstatableValue) || hasValue(this.reinstatableChange);
  }
}

export class DsoEditMetadataForm {
  originalFieldKeys: string[];
  fieldKeys: string[];
  fields: {
    [mdField: string]: DsoEditMetadataValue[],
  };
  reinstatableNewValues: {
    [mdField: string]: DsoEditMetadataValue[],
  };
  newValue: DsoEditMetadataValue;

  constructor(metadata: MetadataMap) {
    this.originalFieldKeys = [];
    this.fieldKeys = [];
    this.fields = {};
    this.reinstatableNewValues = {};
    Object.entries(metadata).forEach(([mdField, values]: [string, MetadataValue[]]) => {
      this.originalFieldKeys.push(mdField);
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
    this.newValue.editing = false;
    this.addValueToField(this.newValue, mdField);
    this.newValue = undefined;
  }

  private addValueToField(value: DsoEditMetadataValue, mdField: string) {
    if (isEmpty(this.fields[mdField])) {
      this.fieldKeys.push(mdField);
      this.fields[mdField] = [];
    }
    this.fields[mdField].push(value);
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
    Object.entries(this.fields).forEach(([field, values]) => {
      let removeFromIndex = -1;
      values.forEach((value, index) => {
        if (value.change === DsoEditMetadataChangeType.ADD) {
          if (isEmpty(this.reinstatableNewValues[field])) {
            this.reinstatableNewValues[field] = [];
          }
          this.reinstatableNewValues[field].push(value);
          if (removeFromIndex === -1) {
            removeFromIndex = index;
          }
        } else {
          value.discardAndMarkReinstatable();
        }
      });
      if (removeFromIndex > -1) {
        this.fields[field].splice(removeFromIndex, this.fields[field].length - removeFromIndex);
      }
    });
    this.fieldKeys.forEach((field) => {
      if (this.originalFieldKeys.indexOf(field) < 0) {
        delete this.fields[field];
      }
    });
    this.fieldKeys = [...this.originalFieldKeys];
  }

  reinstate(): void {
    Object.values(this.fields).forEach((values) => {
      values.forEach((value) => {
        value.reinstate();
      });
    });
    Object.entries(this.reinstatableNewValues).forEach(([field, values]) => {
      values.forEach((value) => {
        this.addValueToField(value, field);
      });
    });
    this.reinstatableNewValues = {};
  }

  isReinstatable(): boolean {
    return isNotEmpty(this.reinstatableNewValues) ||
      Object.values(this.fields)
        .some((values) => values
          .some((value) => value.isReinstatable()));
  }

  getOperations(): Operation[] {
    const operations: Operation[] = [];
    Object.entries(this.fields).forEach(([field, values]) => {
      values.forEach((value, place) => {
        if (value.hasChanges()) {
          let operation: MetadataPatchOperation;
          if (value.change === DsoEditMetadataChangeType.UPDATE) {
            operation = new MetadataPatchReplaceOperation(field, place, {
              value: value.newValue.value,
              language: value.newValue.language,
            });
          } else if (value.change === DsoEditMetadataChangeType.REMOVE) {
            operation = new MetadataPatchRemoveOperation(field, place);
          } else if (value.change === DsoEditMetadataChangeType.ADD) {
            operation = new MetadataPatchAddOperation(field, {
              value: value.newValue.value,
              language: value.newValue.language,
            });
          } else {
            console.warn('Illegal metadata change state detected for', value);
          }
          if (hasValue(operation)) {
            operations.push(operation.toOperation());
          }
        }
      });
    });
    return operations;
  }
}
