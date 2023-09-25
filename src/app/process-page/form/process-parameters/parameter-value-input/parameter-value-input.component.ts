import { Component, EventEmitter, Input, Optional, Output } from '@angular/core';
import { ScriptParameterType } from '../../../scripts/script-parameter-type.model';
import { ScriptParameter } from '../../../scripts/script-parameter.model';
import { ControlContainer, NgForm } from '@angular/forms';
import { controlContainerFactory } from '../../process-form.component';
import { BooleanValueInputComponent } from './boolean-value-input/boolean-value-input.component';
import { FileValueInputComponent } from './file-value-input/file-value-input.component';
import { DateValueInputComponent } from './date-value-input/date-value-input.component';
import { StringValueInputComponent } from './string-value-input/string-value-input.component';
import { NgSwitch, NgSwitchCase } from '@angular/common';

/**
 * Component that renders the correct parameter value input based the script parameter's type
 */
@Component({
    selector: 'ds-parameter-value-input',
    templateUrl: './parameter-value-input.component.html',
    styleUrls: ['./parameter-value-input.component.scss'],
    viewProviders: [{ provide: ControlContainer,
            useFactory: controlContainerFactory,
            deps: [[new Optional(), NgForm]] }],
    standalone: true,
    imports: [NgSwitch, NgSwitchCase, StringValueInputComponent, DateValueInputComponent, FileValueInputComponent, BooleanValueInputComponent]
})
export class ParameterValueInputComponent {
  @Input() index: number;

  /**
   * The current script parameter
   */
  @Input() parameter: ScriptParameter;

  /**
   * Initial value for input
   */
  @Input() initialValue: any;
  /**
   * Emits the value of the input when its updated
   */
  @Output() updateValue: EventEmitter<any> = new EventEmitter();

  /**
   * The available script parameter types
   */
  parameterTypes = ScriptParameterType;
}
