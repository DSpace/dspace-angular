import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { Context } from '../../../core/shared/context.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DsoEditMetadataValue } from '../dso-edit-metadata-form';
import { EditMetadataValueFieldType } from './dso-edit-metadata-field-type.enum';

/**
 * Abstract base component for editing metadata fields.
 *
 * This abstract component is only designed to contain the common `@Input()` & `@Output()` fields, that the
 * {@link DsoEditMetadataValueFieldLoaderComponent} passes to its dynamically generated components. This class should
 * not contain any methods or any other type of logic. Such logic should instead be created in
 * {@link DsoEditMetadataFieldService}.
 */
@Component({
  selector: 'ds-abstract-dso-edit-metadata-value-field',
  template: '',
  standalone: true,
})
export abstract class AbstractDsoEditMetadataValueFieldComponent {

  /**
   * The optional context
   */
  @Input() context: Context;

  /**
   * The {@link DSpaceObject}
   */
  @Input() dso: DSpaceObject;

  /**
   * The type of the DSO, used to determines i18n messages
   */
  @Input() dsoType: string;

  /**
   * The type of the field
   */
  @Input() type: EditMetadataValueFieldType;

  /**
   * The metadata field
   */
  @Input() mdField: string;

  /**
   * Editable metadata value to show
   */
  @Input() mdValue: DsoEditMetadataValue;

  /**
   * Emits when the user clicked confirm
   */
  @Output() confirm: EventEmitter<boolean> = new EventEmitter();

}
