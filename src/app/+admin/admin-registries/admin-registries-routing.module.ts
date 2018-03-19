import { MetadataRegistryComponent } from './metadata-registry/metadata-registry.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MetadataSchemaComponent } from './metadata-schema/metadata-schema.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'metadata', component: MetadataRegistryComponent, data: { title: 'admin.registries.metadata.title' } },
      { path: 'metadata/:schemaName', component: MetadataSchemaComponent, data: { title: 'admin.registries.schema.title' } }
    ])
  ]
})
export class AdminRegistriesRoutingModule {

}
