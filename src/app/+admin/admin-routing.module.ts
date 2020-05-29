import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { getAdminModulePath } from '../app-routing.module';
import { AdminSearchPageComponent } from './admin-search-page/admin-search-page.component';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { AdminWorkflowPageComponent } from './admin-workflow-page/admin-workflow-page.component';
import { I18nBreadcrumbsService } from '../core/breadcrumbs/i18n-breadcrumbs.service';
import { URLCombiner } from '../core/url-combiner/url-combiner';

const REGISTRIES_MODULE_PATH = 'registries';
export const ACCESS_CONTROL_MODULE_PATH = 'access-control';

export function getRegistriesModulePath() {
  return new URLCombiner(getAdminModulePath(), REGISTRIES_MODULE_PATH).toString();
}

export function getAccessControlModulePath() {
  return new URLCombiner(getAdminModulePath(), ACCESS_CONTROL_MODULE_PATH).toString();
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
      {
        path: 'workflow',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        component: AdminWorkflowPageComponent,
        data: { title: 'admin.workflow.title', breadcrumbKey: 'admin.workflow' }
      },
    ])
  ],
  providers: [
    I18nBreadcrumbResolver,
    I18nBreadcrumbsService
  ]
})
export class AdminRoutingModule {

}
