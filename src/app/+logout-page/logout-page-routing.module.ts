import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LogoutPageComponent } from './logout-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [AuthenticatedGuard],
        path: '',
        component: LogoutPageComponent,
        data: { title: 'logout.title' }
      }
    ])
  ]
})
export class LogoutPageRoutingModule { }
