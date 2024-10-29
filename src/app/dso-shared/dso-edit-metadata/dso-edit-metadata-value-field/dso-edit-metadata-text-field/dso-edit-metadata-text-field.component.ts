import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DebounceDirective } from '../../../../shared/utils/debounce.directive';
import { AbstractDsoEditMetadataValueFieldComponent } from '../abstract-dso-edit-metadata-value-field.component';

/**
 * The component used to gather input for plain-text metadata fields
 */
@Component({
  selector: 'ds-dso-edit-metadata-text-field',
  templateUrl: './dso-edit-metadata-text-field.component.html',
  styleUrls: ['./dso-edit-metadata-text-field.component.scss'],
  standalone: true,
  imports: [
    DebounceDirective,
    FormsModule,
    TranslateModule,
  ],
})
export class DsoEditMetadataTextFieldComponent extends AbstractDsoEditMetadataValueFieldComponent {
}
