import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DsoEditMetadataComponent } from './dso-edit-metadata/dso-edit-metadata.component';
import { MetadataFieldSelectorComponent } from './dso-edit-metadata/metadata-field-selector/metadata-field-selector.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    DsoEditMetadataComponent,
    MetadataFieldSelectorComponent,
  ],
  exports: [
    DsoEditMetadataComponent,
  ],
})
export class DsoSharedModule {

}
