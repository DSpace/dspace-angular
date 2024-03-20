import {
  Component,
  Input,
  OnInit,
  Optional,
} from '@angular/core';
import {
  ControlContainer,
  NgForm,
} from '@angular/forms';

import { controlContainerFactory } from '../../../process-form.component';
import { ValueInputComponent } from '../value-input.component';

/**
 * Represents the user inputted value of a date parameter
 */
@Component({
  selector: 'ds-date-value-input',
  templateUrl: './date-value-input.component.html',
  styleUrls: ['./date-value-input.component.scss'],
  viewProviders: [ { provide: ControlContainer,
    useFactory: controlContainerFactory,
    deps: [[new Optional(), NgForm]] } ],
})
export class DateValueInputComponent extends ValueInputComponent<string> implements OnInit {
  /**
   * The current value of the date string
   */
  value: string;

  /**
   * Initial value of the field
   */
  @Input() initialValue;

  ngOnInit(): void {
    this.value = this.initialValue;
  }

  setValue(value) {
    this.value = value;
    this.updateValue.emit(value);
  }
}
