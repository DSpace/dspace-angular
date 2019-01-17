import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {AuthenticatedGuard} from "../core/auth/authenticated.guard";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'registries', loadChildren: './admin-registries/admin-registries.module#AdminRegistriesModule', canActivate: [AuthenticatedGuard] }
    ])
  ]
})
export class AdminRoutingModule {

}
