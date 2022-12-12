import { MetadataMap, MetadataValue } from '../../core/shared/metadata.models';
import { hasNoValue, hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { Operation } from 'fast-json-patch';
import { MetadataPatchReplaceOperation } from '../../core/data/object-updates/patch-operation-service/operations/metadata/metadata-patch-replace-operation.model';
import { MetadataPatchRemoveOperation } from '../../core/data/object-updates/patch-operation-service/operations/metadata/metadata-patch-remove-operation.model';
import { MetadataPatchAddOperation } from '../../core/data/object-updates/patch-operation-service/operations/metadata/metadata-patch-add-operation.model';
import { MetadataPatchOperation } from '../../core/data/object-updates/patch-operation-service/operations/metadata/metadata-patch-operation.model';

/* tslint:disable:max-classes-per-file */

/**
 * Enumeration for the type of change occurring on a metadata value
 */
export enum DsoEditMetadataChangeType {
  UPDATE = 1,
  ADD = 2,
  REMOVE = 3
}

/**
 * Class holding information about a metadata value and its changes within an edit form
 */
export class DsoEditMetadataValue {
  /**
   * The original metadata value (should stay the same!) used to compare changes with
   */
  originalValue: MetadataValue;

  /**
   * The new value, dynamically changing
   */
  newValue: MetadataValue;

  /**
   * A value that can be used to undo any discarding that took place
   */
  reinstatableValue: MetadataValue;

  /**
   * Whether or not this value is currently being edited or not
   */
  editing = false;

  /**
   * The type of change that's taking place on this metadata value
   * Empty if no changes are made
   */
  change: DsoEditMetadataChangeType;

  /**
   * A type or change that can be used to undo any discarding that took place
   */
  reinstatableChange: DsoEditMetadataChangeType;

  constructor(value: MetadataValue, added = false) {
    this.originalValue = value;
    this.newValue = Object.assign(new MetadataValue(), value);
    if (added) {
      this.change = DsoEditMetadataChangeType.ADD;
      this.editing = true;
    }
  }

  /**
   * Save the current changes made to the metadata value
   * This will set the type of change to UPDATE if the new metadata value's value and/or language are different from
   * the original value
   * It will also set the editing flag to false
   */
  confirmChanges(finishEditing = false) {
    if (hasNoValue(this.change) || this.change === DsoEditMetadataChangeType.UPDATE) {
      if ((this.originalValue.value !== this.newValue.value || this.originalValue.language !== this.newValue.language)) {
        this.change = DsoEditMetadataChangeType.UPDATE;
      } else {
        this.change = undefined;
      }
    }
    if (finishEditing) {
      this.editing = false;
    }
  }

  /**
   * Returns if the current value contains changes or not
   * If the metadata value contains changes, but they haven't been confirmed yet through confirmChanges(), this might
   * return false (which is desired)
   */
  hasChanges(): boolean {
    return hasValue(this.change);
  }

  /**
   * Discard the current changes and mark the value and change type re-instatable by storing them in their relevant
   * properties
   */
  discardAndMarkReinstatable(): void {
    if (this.change === DsoEditMetadataChangeType.UPDATE) {
      this.reinstatableValue = this.newValue;
    }
    this.reinstatableChange = this.change;
    this.discard();
  }

  /**
   * Discard the current changes
   * Call discardAndMarkReinstatable() instead, if the discard should be re-instatable
   */
  discard(): void {
    this.change = undefined;
    this.newValue = Object.assign(new MetadataValue(), this.originalValue);
    this.editing = false;
  }

  /**
   * Re-instate (undo) the last discard by replacing the value and change type with their reinstate properties (if present)
   */
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

  /**
   * Returns if either the value or change type have a re-instatable property
   * This will be the case if a discard has taken place that undid changes to the value or type
   */
  isReinstatable(): boolean {
    return hasValue(this.reinstatableValue) || hasValue(this.reinstatableChange);
  }

  /**
   * Reset the state of the re-instatable properties
   */
  resetReinstatable() {
    this.reinstatableValue = undefined;
    this.reinstatableChange = undefined;
  }
}

/**
 * Class holding information about the metadata of a DSpaceObject and its changes within an edit form
 */
export class DsoEditMetadataForm {
  /**
   * List of original metadata field keys (before any changes took place)
   */
  originalFieldKeys: string[];

  /**
   * List of current metadata field keys (includes new fields for values added by the user)
   */
  fieldKeys: string[];

  /**
   * Current state of the form
   * Key: Metadata field
   * Value: List of {@link DsoEditMetadataValue}s for the metadata field
   */
  fields: {
    [mdField: string]: DsoEditMetadataValue[],
  };

  /**
   * A map of previously added metadata values before a discard of the form took place
   * This can be used to re-instate the entire form to before the discard taking place
   */
  reinstatableNewValues: {
    [mdField: string]: DsoEditMetadataValue[],
  };

  /**
   * A (temporary) new metadata value added by the user, not belonging to a metadata field yet
   * This value will be finalised and added to a field using setMetadataField()
   */
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

  /**
   * Add a new temporary value for the user to edit
   */
  add(): void {
    if (hasNoValue(this.newValue)) {
      this.newValue = new DsoEditMetadataValue(new MetadataValue(), true);
    }
  }

  /**
   * Add the temporary value to a metadata field
   * Clear the temporary value afterwards
   * @param mdField
   */
  setMetadataField(mdField: string) {
    this.newValue.editing = false;
    this.addValueToField(this.newValue, mdField);
    this.newValue = undefined;
  }

  /**
   * Add a value to a metadata field within the map
   * @param value
   * @param mdField
   * @private
   */
  private addValueToField(value: DsoEditMetadataValue, mdField: string) {
    if (isEmpty(this.fields[mdField])) {
      this.fieldKeys.push(mdField);
      this.fields[mdField] = [];
    }
    this.fields[mdField].push(value);
  }

  /**
   * Remove a value from a metadata field on a given index (this actually removes the value, not just marking it deleted)
   * @param mdField
   * @param index
   */
  remove(mdField: string, index: number) {
    if (isNotEmpty(this.fields[mdField])) {
      this.fields[mdField].splice(index, 1);
      if (this.fields[mdField].length === 0) {
        this.fieldKeys.splice(this.fieldKeys.indexOf(mdField), 1);
        delete this.fields[mdField];
      }
    }
  }

  /**
   * Returns if at least one value within the form contains a change
   */
  hasChanges(): boolean {
    return Object.values(this.fields).some((values) => values.some((value) => value.hasChanges()));
  }

  /**
   * Discard all changes within the form and store their current values within re-instatable properties so they can be
   * undone afterwards
   */
  discard(): void {
    this.resetReinstatable();
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

  /**
   * Returns if at least one value contains a re-instatable property, meaning a discard can be reversed
   */
  isReinstatable(): boolean {
    return isNotEmpty(this.reinstatableNewValues) ||
      Object.values(this.fields)
        .some((values) => values
          .some((value) => value.isReinstatable()));
  }

  /**
   * Reset the state of the re-instatable properties and values
   */
  resetReinstatable() {
    this.reinstatableNewValues = {};
    Object.values(this.fields).forEach((values) => {
      values.forEach((value) => {
        value.resetReinstatable();
      });
    });
  }

  /**
   * Get the json PATCH operations for the current changes within this form
   */
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
/* tslint:enable:max-classes-per-file */
