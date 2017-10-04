import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-error',
  styleUrls: ['./error.component.scss'],
  templateUrl: './error.component.html'
})
export class ErrorComponent {

  @Input() message = 'Error...';

}
