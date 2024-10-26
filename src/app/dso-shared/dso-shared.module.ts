import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DsoEditMetadataComponent } from './dso-edit-metadata/dso-edit-metadata.component';
import { MetadataFieldSelectorComponent } from './dso-edit-metadata/metadata-field-selector/metadata-field-selector.component';
import { DsoEditMetadataFieldValuesComponent } from './dso-edit-metadata/dso-edit-metadata-field-values/dso-edit-metadata-field-values.component';
import { DsoEditMetadataValueComponent } from './dso-edit-metadata/dso-edit-metadata-value/dso-edit-metadata-value.component';
import { DsoEditMetadataHeadersComponent } from './dso-edit-metadata/dso-edit-metadata-headers/dso-edit-metadata-headers.component';
import { DsoEditMetadataValueHeadersComponent } from './dso-edit-metadata/dso-edit-metadata-value-headers/dso-edit-metadata-value-headers.component';
import { ThemedDsoEditMetadataComponent } from './dso-edit-metadata/themed-dso-edit-metadata.component';
import { DsoEditMetadataValueFieldLoaderComponent } from './dso-edit-metadata/dso-edit-metadata-value-field/dso-edit-metadata-value-field-loader/dso-edit-metadata-value-field-loader.component';
import { DsoEditMetadataTextFieldComponent } from './dso-edit-metadata/dso-edit-metadata-value-field/dso-edit-metadata-text-field/dso-edit-metadata-text-field.component';
import { DsoEditMetadataValueFieldLoaderDirective } from './dso-edit-metadata/dso-edit-metadata-value-field/dso-edit-metadata-value-field-loader/dso-edit-metadata-value-field-loader.directive';
import { DsoEditMetadataEntityFieldComponent } from './dso-edit-metadata/dso-edit-metadata-value-field/dso-edit-metadata-entity-field/dso-edit-metadata-entity-field.component';

const ENTRY_COMPONENTS = [
  DsoEditMetadataTextFieldComponent,
  DsoEditMetadataEntityFieldComponent,
];

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ...ENTRY_COMPONENTS,
    DsoEditMetadataComponent,
    ThemedDsoEditMetadataComponent,
    MetadataFieldSelectorComponent,
    DsoEditMetadataFieldValuesComponent,
    DsoEditMetadataValueComponent,
    DsoEditMetadataHeadersComponent,
    DsoEditMetadataValueHeadersComponent,
    DsoEditMetadataValueFieldLoaderComponent,
    DsoEditMetadataValueFieldLoaderDirective,
  ],
  exports: [
    DsoEditMetadataComponent,
    ThemedDsoEditMetadataComponent,
    MetadataFieldSelectorComponent,
    DsoEditMetadataFieldValuesComponent,
    DsoEditMetadataValueComponent,
    DsoEditMetadataHeadersComponent,
    DsoEditMetadataValueHeadersComponent,
  ],
  providers: [
    ...ENTRY_COMPONENTS,
  ],
})
export class DsoSharedModule {

}
