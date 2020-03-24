import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProcessParameter } from '../../../processes/process-parameter.model';
import { ScriptParameter } from '../../../scripts/script-parameter.model';
import { hasNoValue } from '../../../../shared/empty.util';

@Component({
  selector: 'ds-parameter-select',
  templateUrl: './parameter-select.component.html',
  styleUrls: ['./parameter-select.component.scss']
})
export class ParameterSelectComponent implements OnInit {
  @Input() parameterValue: ProcessParameter;
  @Input() parameters: ScriptParameter[];
  @Input() removable: boolean;
  @Output() removeParameter: EventEmitter<ProcessParameter> = new EventEmitter<ProcessParameter>();
  @Output() changeParameter: EventEmitter<ProcessParameter> = new EventEmitter<ProcessParameter>();

  ngOnInit(): void {
    if (hasNoValue(this.parameterValue)) {
      this.parameterValue = new ProcessParameter();
    }
  }

  get selectedScriptParameter(): ScriptParameter {
    return this.parameters.find((parameter: ScriptParameter) => parameter.name === this.selectedParameter);
  }

  get selectedParameter(): string {
    return this.parameterValue ? this.parameterValue.name : undefined;
  }

  set selectedParameter(value: string) {
    this.parameterValue.name = value;
    this.selectedParameterValue = undefined;
    this.changeParameter.emit(this.parameterValue);
  }

  get selectedParameterValue(): any {
    return this.parameterValue ? this.parameterValue.value : undefined;
  }

  set selectedParameterValue(value: any) {
    this.parameterValue.value = value;
    this.changeParameter.emit(this.parameterValue);
  }
}
