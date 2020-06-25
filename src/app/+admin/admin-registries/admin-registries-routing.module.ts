import { MetadataRegistryComponent } from './metadata-registry/metadata-registry.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MetadataSchemaComponent } from './metadata-schema/metadata-schema.component';
import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { getRegistriesModulePath } from '../admin-routing.module';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';

const BITSTREAMFORMATS_MODULE_PATH = 'bitstream-formats';

export function getBitstreamFormatsModulePath() {
  return new URLCombiner(getRegistriesModulePath(), BITSTREAMFORMATS_MODULE_PATH).toString();
}

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'metadata',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: {title: 'admin.registries.metadata.title', breadcrumbKey: 'admin.registries.metadata'},
        children: [
          {
            path: '',
            component: MetadataRegistryComponent
          },
          {
            path: ':schemaName',
            resolve: { breadcrumb: I18nBreadcrumbResolver },
            component: MetadataSchemaComponent,
            data: {title: 'admin.registries.schema.title', breadcrumbKey: 'admin.registries.schema'}
          }
        ]
      },
      {
        path: BITSTREAMFORMATS_MODULE_PATH,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        loadChildren: './bitstream-formats/bitstream-formats.module#BitstreamFormatsModule',
        data: {title: 'admin.registries.bitstream-formats.title', breadcrumbKey: 'admin.registries.bitstream-formats'}
      },
    ])
  ]
})
export class AdminRegistriesRoutingModule {

}
