import { NgModule } from '@angular/core';
import { AdminRegistriesModule } from './admin-registries/admin-registries.module';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    AdminRegistriesModule,
    AdminRoutingModule,
    SharedModule,
  ],
})
export class AdminModule {

}
