import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nBreadcrumbResolver } from 'src/app/core/breadcrumbs/i18n-breadcrumb.resolver';
import { LdnServicesOverviewComponent } from './ldn-services-directory/ldn-services-directory.component';
import { LdnServicesGuard } from './ldn-services-guard/ldn-services-guard.service';
import { LdnServiceNewComponent } from './ldn-service-new/ldn-service-new.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: LdnServicesOverviewComponent,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: { title: 'ldn-registered-services.title', breadcrumbKey: 'ldn-registered-services.new' },
        canActivate: [LdnServicesGuard]
      },
      {
        path: 'new',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        component: LdnServiceNewComponent,
        data: { title: 'ldn-register-new-service.title', breadcrumbKey: 'ldn-register-new-service' }
      },
    ]),
  ]
})
export class AdminLdnServicesRoutingModule {

}
