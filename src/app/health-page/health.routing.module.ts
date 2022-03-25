import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { HealthComponent } from './health/health.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
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
