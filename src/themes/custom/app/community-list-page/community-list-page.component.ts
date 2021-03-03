import { Component } from '@angular/core';
import { CommunityListPageComponent as BaseComponent } from '../../../../app/community-list-page/community-list-page.component';

@Component({
  selector: 'ds-community-list-page',
  // styleUrls: ['./community-list-page.component.scss'],
  // templateUrl: './community-list-page.component.html'
  templateUrl: '../../../../app/community-list-page/community-list-page.component.html'
})

/**
 * Component to render the news section on the home page
 */
export class CommunityListPageComponent extends BaseComponent {}

