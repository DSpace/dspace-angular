import { Component } from '@angular/core';
import { ValueInputComponent } from '../value-input.component';

/**
 * Represents the user inputted value of a string parameter
 */
@Component({
  selector: 'ds-string-value-input',
  templateUrl: './string-value-input.component.html',
  styleUrls: ['./string-value-input.component.scss']
})
export class StringValueInputComponent extends ValueInputComponent<string> {
  /**
   * The current value of the string
   */
  value: string;

  setValue(value) {
    this.value = value;
    this.updateValue.emit(value)
  }
}
