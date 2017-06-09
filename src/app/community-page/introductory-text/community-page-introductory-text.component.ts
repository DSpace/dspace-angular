import { Component, Input } from '@angular/core';


@Component({
  selector: 'ds-community-page-introductory-text',
  styleUrls: ['./community-page-introductory-text.component.css'],
  templateUrl: './community-page-introductory-text.component.html',
})
export class CommunityPageIntroductoryTextComponent {
  @Input() introductoryText: String;
}
