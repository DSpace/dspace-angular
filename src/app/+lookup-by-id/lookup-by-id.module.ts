import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LookupRoutingModule } from './lookup-by-id-routing.module';
import { ObjectNotFoundComponent } from './objectnotfound/objectnotfound.component';
import { DsoDataRedirectService } from '../core/data/dso-data-redirect.service';

@NgModule({
  imports: [
    LookupRoutingModule,
    CommonModule,
    SharedModule,
  ],
  declarations: [
    ObjectNotFoundComponent
  ],
  providers: [
    DsoDataRedirectService
  ]
})
export class LookupIdModule {

}
