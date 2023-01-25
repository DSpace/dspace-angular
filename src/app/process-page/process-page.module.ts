import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProcessPageRoutingModule } from './process-page-routing.module';
import { ProcessPageSharedModule } from './process-page-shared.module';

@NgModule({
  imports: [
    ProcessPageRoutingModule,
    SharedModule,
    ProcessPageSharedModule,
  ],
  declarations: [
  ],
  providers: [
  ]
})

export class ProcessPageModule {

}
