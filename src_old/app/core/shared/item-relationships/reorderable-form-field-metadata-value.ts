import { UntypedFormControl } from '@angular/forms';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { DynamicFormArrayGroupModel } from '@ng-dynamic-forms/core';

import { FormFieldMetadataValueObject } from '../form/models/form-field-metadata-value.model';
import { Reorderable } from './reordable';

/**
 * A Reorderable representation of a FormFieldMetadataValue
 */
export class ReorderableFormFieldMetadataValue extends Reorderable {

  constructor(
    public metadataValue: FormFieldMetadataValueObject,
    public model: any,
    public control: UntypedFormControl,
    public group: DynamicFormArrayGroupModel,
    oldIndex?: number,
    newIndex?: number,
  ) {
    super(oldIndex, newIndex);
    this.metadataValue = metadataValue;
  }

  /**
   * Return the id for this Reorderable
   */
  getId(): string {
    if (hasValue(this.metadataValue.authority)) {
      return this.metadataValue.authority;
    } else {
      // can't use UUIDs, they're generated client side
      return this.metadataValue.value;
    }
  }

  /**
   * Return the place metadata for this Reorderable
   */
  getPlace(): number {
    return this.metadataValue.place;
  }

}
