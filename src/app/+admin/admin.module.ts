import { NgModule } from '@angular/core';
import { AdminRegistriesModule } from './admin-registries/admin-registries.module';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminSearchPageComponent } from './admin-search-page/admin-search-page.component';
import { SearchPageModule } from '../+search-page/search-page.module';

@NgModule({
  imports: [
    AdminRegistriesModule,
    AdminRoutingModule,
    SharedModule,
    SearchPageModule
  ],
  declarations: [AdminSearchPageComponent],
})
export class AdminModule {

}
