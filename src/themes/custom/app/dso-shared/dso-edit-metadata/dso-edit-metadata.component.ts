import {
  AsyncPipe,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DsoEditMetadataComponent as BaseComponent } from '../../../../../app/dso-shared/dso-edit-metadata/dso-edit-metadata.component';
import { DsoEditMetadataFieldValuesComponent } from '../../../../../app/dso-shared/dso-edit-metadata/dso-edit-metadata-field-values/dso-edit-metadata-field-values.component';
import { DsoEditMetadataHeadersComponent } from '../../../../../app/dso-shared/dso-edit-metadata/dso-edit-metadata-headers/dso-edit-metadata-headers.component';
import { DsoEditMetadataValueComponent } from '../../../../../app/dso-shared/dso-edit-metadata/dso-edit-metadata-value/dso-edit-metadata-value.component';
import { DsoEditMetadataValueHeadersComponent } from '../../../../../app/dso-shared/dso-edit-metadata/dso-edit-metadata-value-headers/dso-edit-metadata-value-headers.component';
import { MetadataFieldSelectorComponent } from '../../../../../app/dso-shared/dso-edit-metadata/metadata-field-selector/metadata-field-selector.component';
import { AlertComponent } from '../../../../../app/shared/alert/alert.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';

@Component({
  selector: 'ds-themed-dso-edit-metadata',
  // styleUrls: ['./dso-edit-metadata.component.scss'],
  styleUrls: ['../../../../../app/dso-shared/dso-edit-metadata/dso-edit-metadata.component.scss'],
  // templateUrl: './dso-edit-metadata.component.html',
  templateUrl: '../../../../../app/dso-shared/dso-edit-metadata/dso-edit-metadata.component.html',
  standalone: true,
  imports: [NgIf, DsoEditMetadataHeadersComponent, MetadataFieldSelectorComponent, DsoEditMetadataValueHeadersComponent, DsoEditMetadataValueComponent, NgFor, DsoEditMetadataFieldValuesComponent, AlertComponent, ThemedLoadingComponent, AsyncPipe, TranslateModule],
})
export class DsoEditMetadataComponent extends BaseComponent {
}
