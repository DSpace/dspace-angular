import {
  AsyncPipe,
  NgClass,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  APP_CONFIG,
  AppConfig,
} from 'src/config/app-config.interface';

import { Site } from '../core/shared/site.model';
import { SuggestionsPopupComponent } from '../notifications/suggestions-popup/suggestions-popup.component';
import { ThemedConfigurationSearchPageComponent } from '../search-page/themed-configuration-search-page.component';
import { ThemedSearchFormComponent } from '../shared/search-form/themed-search-form.component';
import { PageWithSidebarComponent } from '../shared/sidebar/page-with-sidebar.component';
import { ViewTrackerComponent } from '../statistics/angulartics/dspace/view-tracker.component';
import { HomeCoarComponent } from './home-coar/home-coar.component';
import { ThemedHomeNewsComponent } from './home-news/themed-home-news.component';
import { RecentItemListComponent } from './recent-item-list/recent-item-list.component';
import { ThemedTopLevelCommunityListComponent } from './top-level-community-list/themed-top-level-community-list.component';

@Component({
  selector: 'ds-base-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [ThemedHomeNewsComponent, NgTemplateOutlet, NgIf, ViewTrackerComponent, ThemedSearchFormComponent, ThemedTopLevelCommunityListComponent, RecentItemListComponent, AsyncPipe, TranslateModule, NgClass, SuggestionsPopupComponent, ThemedConfigurationSearchPageComponent, PageWithSidebarComponent, HomeCoarComponent],
})
export class HomePageComponent implements OnInit {

  site$: Observable<Site>;
  recentSubmissionspageSize: number;
  showDiscoverFilters: boolean;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected route: ActivatedRoute,
  ) {
    this.recentSubmissionspageSize = this.appConfig.homePage.recentSubmissions.pageSize;
    this.showDiscoverFilters = this.appConfig.homePage.showDiscoverFilters;
  }

  ngOnInit(): void {
    this.site$ = this.route.data.pipe(
      map((data) => data.site as Site),
    );
  }

}
