import { Component } from '@angular/core';

import { AbstractDsoEditMetadataValueFieldComponent } from '../abstract-dso-edit-metadata-value-field.component';
import { EditMetadataValueFieldType } from '../dso-edit-metadata-field-type.enum';
import { editMetadataValueFieldComponent } from '../dso-edit-metadata-value-field-loader/dso-edit-metadata-value-field.decorator';

/**
 * The component used to gather input for plain-text metadata fields
 */
@Component({
  selector: 'ds-dso-edit-metadata-text-field',
  templateUrl: './dso-edit-metadata-text-field.component.html',
  styleUrls: ['./dso-edit-metadata-text-field.component.scss'],
})
@editMetadataValueFieldComponent(EditMetadataValueFieldType.PLAIN_TEXT)
export class DsoEditMetadataTextFieldComponent extends AbstractDsoEditMetadataValueFieldComponent {
}
