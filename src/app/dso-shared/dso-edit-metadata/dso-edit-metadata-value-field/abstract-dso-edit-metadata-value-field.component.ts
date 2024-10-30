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

@Component({
  selector: 'ds-dso-edit-metadata-entity-field',
  template: '',
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
