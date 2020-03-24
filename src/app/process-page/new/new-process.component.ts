import { Component, OnInit } from '@angular/core';
import { Script } from '../scripts/script.model';
import { Process } from '../processes/process.model';
import { ProcessParameter } from '../processes/process-parameter.model';
import { ScriptDataService } from '../../core/data/processes/script-data.service';

@Component({
  selector: 'ds-new-process',
  templateUrl: './new-process.component.html',
  styleUrls: ['./new-process.component.scss'],
})
export class NewProcessComponent implements OnInit {
  public selectedScript: Script;
  public process: Process;
  public parameters: ProcessParameter[];
  public files: File[] = [];

  constructor(private scriptService: ScriptDataService) {
  }

  ngOnInit(): void {
    this.process = new Process();
  }

  submitForm() {
    const stringParameters: ProcessParameter[] = this.parameters.map((parameter: ProcessParameter) => {
        return {
          name: parameter.name,
          value: this.checkValue(parameter)
        };
      }
    );
    this.scriptService.invocate(this.selectedScript.id, stringParameters, this.files)
  }

  checkValue(processParameter: ProcessParameter): string {
    if (typeof processParameter.value === 'object') {
      this.files = [...this.files, processParameter.value];
      return processParameter.value.name;
    }
    return processParameter.value;
  }
}
