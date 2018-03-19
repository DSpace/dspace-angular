import { NgModule } from '@angular/core';
import { AdminRegistriesModule } from './admin-registries/admin-registries.module';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  imports: [
    AdminRegistriesModule,
    AdminRoutingModule
  ]
})
export class AdminModule {

}
