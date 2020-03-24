import { Component, OnInit } from '@angular/core';
import { ValueInputComponent } from '../value-input.component';

@Component({
  selector: 'ds-boolean-value-input',
  templateUrl: './boolean-value-input.component.html',
  styleUrls: ['./boolean-value-input.component.scss']
})
export class BooleanValueInputComponent extends ValueInputComponent<boolean> implements OnInit {
  ngOnInit() {
    this.updateValue.emit(true)
  }
}
