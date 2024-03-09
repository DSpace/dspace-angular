import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormModule } from '../../shared/form/form.module';
import { SharedModule } from '../../shared/shared.module';
import { AdminRegistriesRoutingModule } from './admin-registries-routing.module';
import { BitstreamFormatsModule } from './bitstream-formats/bitstream-formats.module';
import { MetadataRegistryComponent } from './metadata-registry/metadata-registry.component';
import { MetadataSchemaFormComponent } from './metadata-registry/metadata-schema-form/metadata-schema-form.component';
import { MetadataFieldFormComponent } from './metadata-schema/metadata-field-form/metadata-field-form.component';
import { MetadataSchemaComponent } from './metadata-schema/metadata-schema.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    BitstreamFormatsModule,
    AdminRegistriesRoutingModule,
    FormModule,
  ],
  declarations: [
    MetadataRegistryComponent,
    MetadataSchemaComponent,
    MetadataSchemaFormComponent,
    MetadataFieldFormComponent,
  ],
})
export class AdminRegistriesModule {

}
