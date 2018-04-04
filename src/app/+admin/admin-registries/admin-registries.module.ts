import { NgModule } from '@angular/core';
import { MetadataRegistryComponent } from './metadata-registry/metadata-registry.component';
import { AdminRegistriesRoutingModule } from './admin-registries-routing.module';
import { CommonModule } from '@angular/common';
import { MetadataSchemaComponent } from './metadata-schema/metadata-schema.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BitstreamFormatsComponent } from './bitstream-formats/bitstream-formats.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    TranslateModule,
    AdminRegistriesRoutingModule
  ],
  declarations: [
    MetadataRegistryComponent,
    MetadataSchemaComponent,
    BitstreamFormatsComponent
  ]
})
export class AdminRegistriesModule {

}
