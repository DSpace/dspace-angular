import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-process-detail-field',
  templateUrl: './process-detail-field.component.html',
})
export class ProcessDetailFieldComponent {
  @Input() title: string;
}
