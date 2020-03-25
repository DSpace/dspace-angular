import { Component, OnInit } from '@angular/core';
import { ValueInputComponent } from '../value-input.component';

/**
 * Represents the user inputted value of a date parameter
 */
@Component({
  selector: 'ds-date-value-input',
  templateUrl: './date-value-input.component.html',
  styleUrls: ['./date-value-input.component.scss']
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
