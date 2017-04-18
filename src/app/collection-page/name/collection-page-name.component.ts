import { Component, Input } from '@angular/core';


@Component({
  selector: 'ds-collection-page-name',
  styleUrls: ['./collection-page-name.component.css'],
  templateUrl: './collection-page-name.component.html',
})
export class CollectionPageNameComponent {
  @Input() name: String;
}
