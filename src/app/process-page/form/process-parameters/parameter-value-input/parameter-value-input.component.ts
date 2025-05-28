
import {
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
} from '@angular/core';
import {
  ControlContainer,
  NgForm,
} from '@angular/forms';

import { ScriptParameter } from '../../../scripts/script-parameter.model';
import { ScriptParameterType } from '../../../scripts/script-parameter-type.model';
import { controlContainerFactory } from '../../process-form-factory';
import { BooleanValueInputComponent } from './boolean-value-input/boolean-value-input.component';
import { DateValueInputComponent } from './date-value-input/date-value-input.component';
import { FileValueInputComponent } from './file-value-input/file-value-input.component';
import { IntegerValueInputComponent } from './number-value-input/integer-value-input.component';
import { StringValueInputComponent } from './string-value-input/string-value-input.component';

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
  imports: [
    BooleanValueInputComponent,
    DateValueInputComponent,
    FileValueInputComponent,
    IntegerValueInputComponent,
    StringValueInputComponent,
  ],
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
