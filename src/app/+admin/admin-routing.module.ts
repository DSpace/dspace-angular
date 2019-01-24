import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'registries',
        loadChildren: './admin-registries/admin-registries.module#AdminRegistriesModule'
      }
    ])
  ]
})
export class AdminRoutingModule {

}
