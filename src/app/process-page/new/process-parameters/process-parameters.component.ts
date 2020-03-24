import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Script } from '../../scripts/script.model';
import { ProcessParameter } from '../../processes/process-parameter.model';
import { hasValue } from '../../../shared/empty.util';

@Component({
  selector: 'ds-process-parameters',
  templateUrl: './process-parameters.component.html',
  styleUrls: ['./process-parameters.component.scss']
})
export class ProcessParametersComponent implements OnChanges {
  @Input() script: Script;
  @Output() updateParameters: EventEmitter<ProcessParameter[]> = new EventEmitter();
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
    this.updateParameters.emit(this.parameterValues.filter((param: ProcessParameter) => hasValue(param.name)));
  }

  removeParameter(index: number) {
    this.parameterValues = this.parameterValues.filter((value, i) => i !== index);
  }

  addParameter() {
    this.parameterValues = [...this.parameterValues, new ProcessParameter()];
  }
}
