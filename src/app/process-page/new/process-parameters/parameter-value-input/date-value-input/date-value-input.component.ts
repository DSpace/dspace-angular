import { Component, OnInit, Optional } from '@angular/core';
import { ValueInputComponent } from '../value-input.component';
import { ControlContainer, NgForm } from '@angular/forms';
import { controlContainerFactory } from '../../../new-process.component';

/**
 * Represents the user inputted value of a date parameter
 */
@Component({
  selector: 'ds-date-value-input',
  templateUrl: './date-value-input.component.html',
  styleUrls: ['./date-value-input.component.scss'],
  viewProviders: [ { provide: ControlContainer,
    useFactory: controlContainerFactory,
    deps: [[new Optional(), NgForm]] } ]
})
export class DateValueInputComponent extends ValueInputComponent<string> {
  /**
   * The current value of the date string
   */
  value: string;

  setValue(value) {
    this.value = value;
    this.updateValue.emit(value)
  }
}
