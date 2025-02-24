import { Route } from '@angular/router';
import { siteAdministratorGuard } from '@dspace/core';

import { SystemWideAlertFormComponent } from './alert-form/system-wide-alert-form.component';

export const ROUTES: Route[] = [
  {
    path: '',
    canActivate: [siteAdministratorGuard],
    component: SystemWideAlertFormComponent,
  },

];
