import { Component, Input } from '@angular/core';


@Component({
  selector: 'ds-dso-name',
  styleUrls: ['./dso-name.component.css'],
  templateUrl: './dso-name.component.html',
})
export class DsoNameComponent {
  @Input() name: String;
}
