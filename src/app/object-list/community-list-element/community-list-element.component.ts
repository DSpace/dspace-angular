import { Component, Input } from '@angular/core';

import { Community } from '../../core/shared/community.model';

@Component({
  selector: 'ds-community-list-element',
  styleUrls: ['./community-list-element.component.scss'],
  templateUrl: './community-list-element.component.html'
})
export class CommunityListElementComponent {

  @Input() community: Community;

  data: any = {};

}
