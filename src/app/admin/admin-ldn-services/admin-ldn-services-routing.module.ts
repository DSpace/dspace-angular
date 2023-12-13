import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LdnServicesOverviewComponent} from './ldn-services-directory/ldn-services-directory.component';
import {LdnServiceNewComponent} from './ldn-service-new/ldn-service-new.component';
import {LdnServiceFormEditComponent} from './ldn-service-form-edit/ldn-service-form-edit.component';
import {NavigationBreadcrumbResolver} from "../../core/breadcrumbs/navigation-breadcrumb.resolver";
import {I18nBreadcrumbResolver} from "../../core/breadcrumbs/i18n-breadcrumb.resolver";


const moduleRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LdnServicesOverviewComponent,
    resolve: {breadcrumb: I18nBreadcrumbResolver},
    data: {title: 'ldn-registered-services.title', breadcrumbKey: 'ldn-registered-services.new'},
  },
  {
    path: 'new',
    resolve: {breadcrumb: NavigationBreadcrumbResolver},
    component: LdnServiceNewComponent,
    data: {title: 'ldn-register-new-service.title', breadcrumbKey: 'ldn-register-new-service'}
  },
  {
    path: 'edit/:serviceId',
    resolve: {breadcrumb: NavigationBreadcrumbResolver},
    component: LdnServiceFormEditComponent,
    data: {title: 'ldn-edit-service.title', breadcrumbKey: 'ldn-edit-service'}
  },
];

const relatedRoutes = moduleRoutes.map(route => {
  return {...route, data: {...route.data, parentRoute: moduleRoutes[0]}}
})

@NgModule({
  imports: [
    RouterModule.forChild(moduleRoutes.map(route => {
      return {...route, data: {...route.data, relatedRoutes }}
    }))
  ]
})
export class AdminLdnServicesRoutingModule {

}
