import { Component, Input } from '@angular/core';


@Component({
  selector: 'ds-collection-page-introductory-text',
  styleUrls: ['./collection-page-introductory-text.component.css'],
  templateUrl: './collection-page-introductory-text.component.html',
})
export class CollectionPageIntroductoryTextComponent {
  @Input() introductoryText: String;
}
