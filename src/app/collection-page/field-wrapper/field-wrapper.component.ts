import { Component, Input } from '@angular/core';


@Component({
  selector: 'ds-field-wrapper',
  styleUrls: ['./field-wrapper.component.css'],
  templateUrl: './field-wrapper.component.html',
})
export class FieldWrapperComponent {
  @Input() name: String;
}
