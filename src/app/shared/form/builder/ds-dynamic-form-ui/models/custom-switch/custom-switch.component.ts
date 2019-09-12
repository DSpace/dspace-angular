import { DynamicNGBootstrapCheckboxComponent } from '@ng-dynamic-forms/ui-ng-bootstrap';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicCustomSwitchModel } from './custom-switch.model';

@Component({
  selector: 'ds-custom-switch',
  styleUrls: ['./custom-switch.component.scss'],
  templateUrl: './custom-switch.component.html',
})
export class CustomSwitchComponent extends DynamicNGBootstrapCheckboxComponent {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicCustomSwitchModel;
  @Output() selected = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();
  @Output() blur = new EventEmitter<any>();
  @Output() change = new EventEmitter<any>();
  @Output() focus = new EventEmitter<any>();
}
