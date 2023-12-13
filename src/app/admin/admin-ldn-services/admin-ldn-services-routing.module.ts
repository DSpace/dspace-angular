import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LdnServicesOverviewComponent} from './ldn-services-directory/ldn-services-directory.component';
import {LdnServiceNewComponent} from './ldn-service-new/ldn-service-new.component';
import {LdnServiceFormEditComponent} from './ldn-service-form-edit/ldn-service-form-edit.component';
import {NavigationBreadcrumbResolver} from "../../core/breadcrumbs/navigation-breadcrumb.resolver";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: LdnServicesOverviewComponent,
        resolve: {breadcrumb: NavigationBreadcrumbResolver},
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
    ]),
  ]
})
export class AdminLdnServicesRoutingModule {

}
