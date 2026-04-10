import { Route } from '@angular/router';

import { siteAdministratorGuard } from '../core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import { SystemWideAlertFormComponent } from './alert-form/system-wide-alert-form.component';

export const ROUTES: Route[] = [
  {
    path: '',
    canActivate: [siteAdministratorGuard],
    component: SystemWideAlertFormComponent,
  },

];
