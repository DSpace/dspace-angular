import { MetadataRegistryComponent } from './metadata-registry/metadata-registry.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MetadataSchemaComponent } from './metadata-schema/metadata-schema.component';
import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { getRegistriesModulePath } from '../admin-routing.module';

const BITSTREAMFORMATS_MODULE_PATH = 'bitstream-formats';

export function getBitstreamFormatsModulePath() {
  return new URLCombiner(getRegistriesModulePath(), BITSTREAMFORMATS_MODULE_PATH).toString();
}

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'metadata', component: MetadataRegistryComponent, data: {title: 'admin.registries.metadata.title'}},
      {
        path: 'metadata/:schemaName',
        component: MetadataSchemaComponent,
        data: {title: 'admin.registries.schema.title'}
      },
      {
        path: BITSTREAMFORMATS_MODULE_PATH,
        loadChildren: './bitstream-formats/bitstream-formats.module#BitstreamFormatsModule',
        data: {title: 'admin.registries.bitstream-formats.title'}
      },
    ])
  ]
})
export class AdminRegistriesRoutingModule {

}
