import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProcessPageRoutingModule } from './process-page-routing.module';
import { ProcessPageSharedModule } from './process-page-shared.module';
import { NumberValueInputComponent } from './form/process-parameters/parameter-value-input/number-value-input/number-value-input.component';

@NgModule({
  imports: [
    ProcessPageRoutingModule,
    SharedModule,
    ProcessPageSharedModule,
  ],
  declarations: [
    NumberValueInputComponent
  ],
  providers: [
  ]
})

export class ProcessPageModule {

}
