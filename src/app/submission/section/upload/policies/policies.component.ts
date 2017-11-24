import {Component, Input} from '@angular/core';

@Component({
  selector: 'ds-policies',
  templateUrl: './policies.component.html',
})
export class PoliciesComponent {

  @Input() policies;

}
