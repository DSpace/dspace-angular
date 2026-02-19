import {
  AsyncPipe,
  NgTemplateOutlet,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { HomeCoarComponent } from '../../../../app/home-page/home-coar/home-coar.component';
import { ThemedHomeNewsComponent } from '../../../../app/home-page/home-news/themed-home-news.component';
import { HomePageComponent as BaseComponent } from '../../../../app/home-page/home-page.component';
import { RecentItemListComponent } from '../../../../app/home-page/recent-item-list/recent-item-list.component';
import { ThemedTopLevelCommunityListComponent } from '../../../../app/home-page/top-level-community-list/themed-top-level-community-list.component';
import { SuggestionsPopupComponent } from '../../../../app/notifications/suggestions/popup/suggestions-popup.component';
import { ThemedSearchFormComponent } from '../../../../app/shared/search-form/themed-search-form.component';
import { ThemedSearchComponent } from '../../../../app/shared/search/themed-search.component';
import { SEARCH_CONFIG_SERVICE } from '../../../../app/my-dspace-page/my-dspace-configuration.service';
import { SearchConfigurationService } from '../../../../app/core/shared/search/search-configuration.service';

@Component({
  selector: 'ds-themed-home-page',
  // styleUrls: ['./home-page.component.scss'],
  styleUrls: ['../../../../app/home-page/home-page.component.scss'],
  // templateUrl: './home-page.component.html'
  templateUrl: '../../../../app/home-page/home-page.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  standalone: true,
  imports: [
    AsyncPipe,
    HomeCoarComponent,
    NgTemplateOutlet,
    RecentItemListComponent,
    SuggestionsPopupComponent,
    ThemedHomeNewsComponent,
    ThemedSearchFormComponent,
    ThemedTopLevelCommunityListComponent,
    TranslateModule,
    ThemedSearchComponent,
  ],
})
export class HomePageComponent extends BaseComponent {
}
