import { Component, Input } from '@angular/core';


@Component({
  selector: 'ds-community-page-name',
  styleUrls: ['./community-page-name.component.css'],
  templateUrl: './community-page-name.component.html',
})
export class CommunityPageNameComponent {
  @Input() name: String;
}
