import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'registries', loadChildren: './admin-registries/admin-registries.module#AdminRegistriesModule' }
    ])
  ]
})
export class AdminRoutingModule {

}
