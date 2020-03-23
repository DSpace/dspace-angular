import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Script } from '../../scripts/script.model';
import { ProcessParameter } from '../../processes/process-parameter.model';

@Component({
  selector: 'ds-process-parameters',
  templateUrl: './process-parameters.component.html',
  styleUrls: ['./process-parameters.component.scss']
})
export class ProcessParametersComponent implements OnChanges {
  @Input() script: Script;
  parameterValues: ProcessParameter[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.script) {
      this.initParameters()
    }
  }

  initParameters() {
    this.parameterValues = [];
    this.addParameter();
  }

  updateParameter(processParameter: ProcessParameter, index: number) {
    this.parameterValues[index] = processParameter;
    if (index === this.parameterValues.length - 1) {
      this.addParameter();
    }
  }

  removeParameter(index: number) {
    this.parameterValues = this.parameterValues.filter((value, i) => i !== index);
  }

  addParameter() {
    this.parameterValues = [...this.parameterValues, new ProcessParameter()];
  }
}
