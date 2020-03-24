import { Component, OnInit } from '@angular/core';
import { ValueInputComponent } from '../value-input.component';

@Component({
  selector: 'ds-date-value-input',
  templateUrl: './date-value-input.component.html',
  styleUrls: ['./date-value-input.component.scss']
})
export class DateValueInputComponent extends ValueInputComponent<string> {
  value: string;

  setValue(value) {
    this.value = value;
    this.updateValue.emit(value)
  }
}
