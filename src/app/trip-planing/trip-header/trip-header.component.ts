import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-trip-header',
  templateUrl: './trip-header.component.html',
  styleUrls: ['./trip-header.component.scss']
})
export class TripHeaderComponent {
  @Input() curruntStep: number;
}
