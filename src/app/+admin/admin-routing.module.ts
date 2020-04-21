import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import { getAdminModulePath } from '../app-routing.module';
import { AdminSearchPageComponent } from './admin-search-page/admin-search-page.component';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';

const REGISTRIES_MODULE_PATH = 'registries';
const ACCESS_CONTROL_MODULE_PATH = 'access-control';

export function getRegistriesModulePath() {
  return new URLCombiner(getAdminModulePath(), REGISTRIES_MODULE_PATH).toString();
}

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: REGISTRIES_MODULE_PATH,
        loadChildren: './admin-registries/admin-registries.module#AdminRegistriesModule'
      },
      {
        path: ACCESS_CONTROL_MODULE_PATH,
        loadChildren: './admin-access-control/admin-access-control.module#AdminAccessControlModule'
      },
      {
        path: 'search',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        component: AdminSearchPageComponent,
        data: { title: 'admin.search.title', breadcrumbKey: 'admin.search' }
      },
    ])
  ]
})
export class AdminRoutingModule {

}
