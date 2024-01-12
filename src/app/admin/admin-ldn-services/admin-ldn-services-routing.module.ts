import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LdnServicesOverviewComponent } from './ldn-services-directory/ldn-services-directory.component';
import { NavigationBreadcrumbResolver } from '../../core/breadcrumbs/navigation-breadcrumb.resolver';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { LdnServiceFormComponent } from './ldn-service-form/ldn-service-form.component';


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
    component: LdnServiceFormComponent,
    data: {title: 'ldn-register-new-service.title', breadcrumbKey: 'ldn-register-new-service'}
  },
  {
    path: 'edit/:serviceId',
    resolve: {breadcrumb: NavigationBreadcrumbResolver},
    component: LdnServiceFormComponent,
    data: {title: 'ldn-edit-service.title', breadcrumbKey: 'ldn-edit-service'}
  },
];


@NgModule({
  imports: [
    RouterModule.forChild(moduleRoutes.map(route => {
      return {...route, data: {
          ...route.data,
          relatedRoutes: moduleRoutes.filter(relatedRoute => relatedRoute.path !== route.path)
            .map((relatedRoute) => {
              return {path: relatedRoute.path, data: relatedRoute.data};
            })
      }};
    }))
  ]
})
export class AdminLdnServicesRoutingModule {

}
