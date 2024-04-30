import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedCommunityListComponent } from '../../../../app/community-list-page/community-list/themed-community-list.component';
import { CommunityListPageComponent as BaseComponent } from '../../../../app/community-list-page/community-list-page.component';

@Component({
  selector: 'ds-themed-community-list-page',
  // styleUrls: ['./community-list-page.component.scss'],
  // templateUrl: './community-list-page.component.html'
  templateUrl: '../../../../app/community-list-page/community-list-page.component.html',
  standalone: true,
  imports: [ThemedCommunityListComponent, TranslateModule],
})

/**
 * Page with title and the community list tree, as described in community-list.component;
 * navigated to with community-list.page.routing.module
 */
export class CommunityListPageComponent extends BaseComponent {}

