import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { HealthComponent } from './health/health.component';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: { breadcrumbKey: 'health' },
        canActivate: [AuthenticatedGuard],
        children: [
          {
            path: '',
            component: HealthComponent,
          },
        ]
      },

    ])
  ]
})
export class HealthPageRoutingModule {

}
