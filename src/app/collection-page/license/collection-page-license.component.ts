import { Component, Input } from '@angular/core';


@Component({
  selector: 'ds-collection-page-license',
  styleUrls: ['./collection-page-license.component.css'],
  templateUrl: './collection-page-license.component.html',
})
export class CollectionPageLicenseComponent {
  @Input() license: String;
}
