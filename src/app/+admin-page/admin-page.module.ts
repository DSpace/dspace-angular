import { NgModule } from '@angular/core';
import { AdminRegistriesModule } from './admin-registries/admin-registries.module';
import { AdminPageRoutingModule } from './admin-page-routing.module';

@NgModule({
  imports: [
    AdminRegistriesModule,
    AdminPageRoutingModule
  ]
})
export class AdminPageModule {

}
