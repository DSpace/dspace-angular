import { Component, Input } from '@angular/core';


@Component({
  selector: 'ds-community-page-news',
  styleUrls: ['./community-page-news.component.css'],
  templateUrl: './community-page-news.component.html',
})
export class CommunityPageNewsComponent {
  @Input() sidebarText: String;
}
