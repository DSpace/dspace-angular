import { Component, Input } from '@angular/core';


@Component({
  selector: 'ds-collection-page-news',
  styleUrls: ['./collection-page-news.component.css'],
  templateUrl: './collection-page-news.component.html',
})
export class CollectionPageNewsComponent {
  @Input() sidebarText: String;
}
