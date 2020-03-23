import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ScriptParameterType } from '../../../scripts/script-parameter-type.model';
import { ScriptParameter } from '../../../scripts/script-parameter.model';

@Component({
  selector: 'ds-parameter-value-input',
  templateUrl: './parameter-value-input.component.html',
  styleUrls: ['./parameter-value-input.component.scss']
})
export class ParameterValueInputComponent {
  @Input() parameter: ScriptParameter;
  parameterTypes = ScriptParameterType;
}
