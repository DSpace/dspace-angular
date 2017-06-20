import { Component, Input } from '@angular/core';


@Component({
  selector: 'ds-comcol-page-header',
  styleUrls: ['./comcol-page-header.component.css'],
  templateUrl: './comcol-page-header.component.html',
})
export class ComcolPageHeaderComponent {
  @Input() name: String;
}
