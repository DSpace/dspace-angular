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
  imports: [
    ThemedCommunityListComponent,
    TranslateModule,
  ],
})
export class CommunityListPageComponent extends BaseComponent {
}
