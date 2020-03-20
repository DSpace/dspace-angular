import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProcessPageRoutingModule } from './process-page-routing.module';
import { NewProcessComponent } from './new/new-process.component';
import { ScriptsSelectComponent } from './new/scripts-select/scripts-select.component';
import { ScriptHelpComponent } from './new/script-help/script-help.component';
import { ParameterSelectComponent } from './new/process-parameters/parameter-select/parameter-select.component';
import { ProcessParametersComponent } from './new/process-parameters/process-parameters.component';
import { StringValueInputComponent } from './new/process-parameters/parameter-value-input/string-value-input/string-value-input.component';
import { ParameterValueInputComponent } from './new/process-parameters/parameter-value-input/parameter-value-input.component';
import { FileValueInputComponent } from './new/process-parameters/parameter-value-input/file-value-input/file-value-input.component';
import { BooleanValueInputComponent } from './new/process-parameters/parameter-value-input/boolean-value-input/boolean-value-input.component';
import { DateValueInputComponent } from './new/process-parameters/parameter-value-input/date-value-input/date-value-input.component';
import { ProcessOverviewComponent } from './overview/process-overview.component';

@NgModule({
  imports: [
    ProcessPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    NewProcessComponent,
    ScriptsSelectComponent,
    ScriptHelpComponent,
    ParameterSelectComponent,
    ProcessParametersComponent,
    StringValueInputComponent,
    ParameterValueInputComponent,
    FileValueInputComponent,
    BooleanValueInputComponent,
    DateValueInputComponent,
    ProcessOverviewComponent
  ],
  entryComponents: []
})

export class ProcessPageModule {

}
