import { Component, Input } from '@angular/core';


@Component({
  selector: 'ds-community-page-copyright',
  styleUrls: ['./community-page-copyright.component.css'],
  templateUrl: './community-page-copyright.component.html',
})
export class CommunityPageCopyrightComponent {
  @Input() copyrightText: String;
}
