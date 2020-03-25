import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Script } from '../../scripts/script.model';
import { ProcessParameter } from '../../processes/process-parameter.model';
import { hasValue } from '../../../shared/empty.util';

/**
 * Component that represents the selected list of parameters for a script
 */
@Component({
  selector: 'ds-process-parameters',
  templateUrl: './process-parameters.component.html',
  styleUrls: ['./process-parameters.component.scss']
})
export class ProcessParametersComponent implements OnChanges {
  /**
   * The currently selected script
   */
  @Input() script: Script;
  /**
   * Emits the parameter values when they're updated
   */
  @Output() updateParameters: EventEmitter<ProcessParameter[]> = new EventEmitter();

  /**
   * The current parameter values
   */
  parameterValues: ProcessParameter[];

  /**
   * Makes sure the parameters are reset when the script changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.script) {
      this.initParameters()
    }
  }

  /**
   * Empties the parameter values
   * Initializes the first parameter value
   */
  initParameters() {
    this.parameterValues = [];
    this.addParameter();
  }

  /**
   * Updates a single parameter value using its new value and index
   * Adds a new parameter when the last of the parameter values is changed
   * @param processParameter The new value of the parameter
   * @param index The index of the parameter
   */
  updateParameter(processParameter: ProcessParameter, index: number) {
    this.parameterValues[index] = processParameter;
    if (index === this.parameterValues.length - 1) {
      this.addParameter();
    }
    this.updateParameters.emit(this.parameterValues.filter((param: ProcessParameter) => hasValue(param.name)));
  }

  /**
   * Removes a parameter value from the list
   * @param index The index of the parameter to remove
   */
  removeParameter(index: number) {
    this.parameterValues = this.parameterValues.filter((value, i) => i !== index);
  }

  /**
   * Adds an empty parameter value to the end of the list
   */
  addParameter() {
    this.parameterValues = [...this.parameterValues, new ProcessParameter()];
  }
}
