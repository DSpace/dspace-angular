import { MetadataRegistryComponent } from './metadata-registry/metadata-registry.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MetadataSchemaComponent } from './metadata-schema/metadata-schema.component';
import { BitstreamFormatsComponent } from './bitstream-formats/bitstream-formats.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'metadata', component: MetadataRegistryComponent, data: { title: 'DSpace Angular :: Metadata Registry' } },
      { path: 'metadata/:schemaName', component: MetadataSchemaComponent, data: { title: 'DSpace Angular :: Metadata Schema Registry' } },
      { path: 'bitstream-formats', component: BitstreamFormatsComponent, data: { title: 'DSpace Angular :: Bitstream Format Registry' } },
    ])
  ]
})
export class AdminRegistriesRoutingModule {

}
