import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SystemWideAlertFormComponent } from './alert-form/system-wide-alert-form.component';
import {
  siteAdministratorGuard
} from '../core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        canActivate: [siteAdministratorGuard],
        component: SystemWideAlertFormComponent,
      },

    ])
  ]
})
export class SystemWideAlertRoutingModule {

}
