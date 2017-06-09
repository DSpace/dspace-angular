import { Component, Input } from '@angular/core';


@Component({
  selector: 'ds-community-page-license',
  styleUrls: ['./community-page-license.component.css'],
  templateUrl: './community-page-license.component.html',
})
export class CommunityPageLicenseComponent {
  @Input() license: String;
}
