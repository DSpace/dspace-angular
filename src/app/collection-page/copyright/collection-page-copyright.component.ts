import { Component, Input } from '@angular/core';


@Component({
  selector: 'ds-collection-page-copyright',
  styleUrls: ['./collection-page-copyright.component.css'],
  templateUrl: './collection-page-copyright.component.html',
})
export class CollectionPageCopyrightComponent {
  @Input() copyrightText: String;
}
