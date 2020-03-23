import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProcessPageRoutingModule } from './process-page-routing.module';
import { ProcessDataService } from '../core/data/processes/process-data.service';
import { ScriptDataService } from '../core/data/processes/script-data.service';
import { NewProcessComponent } from './new/new-process.component';
import { ScriptsSelectComponent } from './new/scripts-select/scripts-select.component';
import { ScriptHelpComponent } from './new/script-help/script-help.component';
import { ParameterSelectComponent } from './new/process-parameters/parameter-select/parameter-select.component';
import { ProcessParametersComponent } from './new/process-parameters/process-parameters.component';
import { StringValueInputComponent } from './new/process-parameters/parameter-value-input/string-value-input/string-value-input.component';
import { ParameterValueInputComponent } from './new/process-parameters/parameter-value-input/parameter-value-input.component';

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
  ],
  entryComponents: []
})

export class ProcessPageModule {

}
