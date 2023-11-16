import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {I18nBreadcrumbResolver} from 'src/app/core/breadcrumbs/i18n-breadcrumb.resolver';
import {LdnServicesOverviewComponent} from './ldn-services-directory/ldn-services-directory.component';
import {LdnServiceNewComponent} from './ldn-service-new/ldn-service-new.component';
import {LdnServiceFormEditComponent} from './ldn-service-form-edit/ldn-service-form-edit.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                component: LdnServicesOverviewComponent,
                resolve: {breadcrumb: I18nBreadcrumbResolver},
                data: {title: 'ldn-registered-services.title', breadcrumbKey: 'ldn-registered-services.new'},
            },
            {
                path: 'new',
                resolve: {breadcrumb: I18nBreadcrumbResolver},
                component: LdnServiceNewComponent,
                data: {title: 'ldn-register-new-service.title', breadcrumbKey: 'ldn-register-new-service'}
            },
            {
                path: 'edit/:serviceId',
                resolve: {breadcrumb: I18nBreadcrumbResolver},
                component: LdnServiceFormEditComponent,
                data: {title: 'ldn-edit-service.title', breadcrumbKey: 'ldn-edit-service'}
            },
        ]),
    ]
})
export class AdminLdnServicesRoutingModule {

}
