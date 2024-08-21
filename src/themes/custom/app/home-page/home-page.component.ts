import {
  AsyncPipe,
  NgClass, NgForOf,
  NgIf, NgSwitch, NgSwitchCase,
  NgTemplateOutlet,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { HomeCoarComponent } from '../../../../app/home-page/home-coar/home-coar.component';
import { ThemedHomeNewsComponent } from '../../../../app/home-page/home-news/themed-home-news.component';
import { HomePageComponent as BaseComponent } from '../../../../app/home-page/home-page.component';
import { RecentItemListComponent } from '../../../../app/home-page/recent-item-list/recent-item-list.component';
import { ThemedTopLevelCommunityListComponent } from '../../../../app/home-page/top-level-community-list/themed-top-level-community-list.component';
import { SuggestionsPopupComponent } from '../../../../app/notifications/suggestions-popup/suggestions-popup.component';
import { ThemedConfigurationSearchPageComponent } from '../../../../app/search-page/themed-configuration-search-page.component';
import { ThemedSearchFormComponent } from '../../../../app/shared/search-form/themed-search-form.component';
import { PageWithSidebarComponent } from '../../../../app/shared/sidebar/page-with-sidebar.component';
import { ViewTrackerComponent } from '../../../../app/statistics/angulartics/dspace/view-tracker.component';
import {
  ThemedTextSectionComponent
} from '../../../../app/shared/explore/section-component/text-section/themed-text-section.component';
import {
  ThemedTopSectionComponent
} from '../../../../app/shared/explore/section-component/top-section/themed-top-section.component';
import {
  ThemedBrowseSectionComponent
} from '../../../../app/shared/explore/section-component/browse-section/themed-browse-section.component';
import {
  ThemedSearchSectionComponent
} from '../../../../app/shared/explore/section-component/search-section/themed-search-section.component';
import {
  ThemedFacetSectionComponent
} from '../../../../app/shared/explore/section-component/facet-section/themed-facet-section.component';
import {
  ThemedCountersSectionComponent
} from '../../../../app/shared/explore/section-component/counters-section/themed-counters-section.component';

@Component({
  selector: 'ds-themed-home-page',
  // styleUrls: ['./home-page.component.scss'],
  styleUrls: ['../../../../app/home-page/home-page.component.scss'],
  // templateUrl: './home-page.component.html'
  templateUrl: '../../../../app/home-page/home-page.component.html',
  standalone: true,
  imports: [
    ThemedTextSectionComponent,
    HomeCoarComponent,
    ThemedHomeNewsComponent,
    NgSwitch,
    NgForOf,
    NgIf,
    ThemedTopSectionComponent,
    NgSwitchCase,
    ThemedBrowseSectionComponent,
    ThemedSearchSectionComponent,
    ThemedFacetSectionComponent,
    ThemedCountersSectionComponent,
    ViewTrackerComponent,
    SuggestionsPopupComponent,
    AsyncPipe,
  ],
})
export class HomePageComponent extends BaseComponent {

}
