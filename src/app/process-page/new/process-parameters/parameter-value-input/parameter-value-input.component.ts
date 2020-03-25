import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ScriptParameterType } from '../../../scripts/script-parameter-type.model';
import { ScriptParameter } from '../../../scripts/script-parameter.model';

/**
 * Component that renders the correct parameter value input based the script parameter's type
 */
@Component({
  selector: 'ds-parameter-value-input',
  templateUrl: './parameter-value-input.component.html',
  styleUrls: ['./parameter-value-input.component.scss']
})
export class ParameterValueInputComponent {
  /**
   * The current script parameter
   */
  @Input() parameter: ScriptParameter;

  /**
   * Emits the value of the input when its updated
   */
  @Output() updateValue: EventEmitter<any> = new EventEmitter();

  /**
   * The available script parameter types
   */
  parameterTypes = ScriptParameterType;
}
