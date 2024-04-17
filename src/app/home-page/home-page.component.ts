import {
  AsyncPipe,
  NgClass,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  APP_CONFIG,
  AppConfig,
} from 'src/config/app-config.interface';

import { Site } from '../core/shared/site.model';
import { SuggestionsPopupComponent } from '../notifications/suggestions-popup/suggestions-popup.component';
import { ConfigurationSearchPageComponent } from '../search-page/configuration-search-page.component';
import { ThemedConfigurationSearchPageComponent } from '../search-page/themed-configuration-search-page.component';
import { HostWindowService } from '../shared/host-window.service';
import { ThemedSearchFormComponent } from '../shared/search-form/themed-search-form.component';
import { PageWithSidebarComponent } from '../shared/sidebar/page-with-sidebar.component';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { ViewTrackerComponent } from '../statistics/angulartics/dspace/view-tracker.component';
import { HomeCoarComponent } from './home-coar/home-coar.component';
import { ThemedHomeNewsComponent } from './home-news/themed-home-news.component';
import { RecentItemListComponent } from './recent-item-list/recent-item-list.component';
import { ThemedTopLevelCommunityListComponent } from './top-level-community-list/themed-top-level-community-list.component';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [ThemedHomeNewsComponent, NgIf, ViewTrackerComponent, ThemedSearchFormComponent, ThemedTopLevelCommunityListComponent, RecentItemListComponent, AsyncPipe, TranslateModule, NgClass, ConfigurationSearchPageComponent, SuggestionsPopupComponent, ThemedConfigurationSearchPageComponent, PageWithSidebarComponent, HomeCoarComponent, FontAwesomeModule],
})
export class HomePageComponent implements OnInit {
  protected readonly faSliders = faSliders;

  site$: Observable<Site>;
  isXsOrSm$: Observable<boolean>;
  recentSubmissionspageSize: number;
  showDiscoverFilters: boolean;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected route: ActivatedRoute,
    protected sidebarService: SidebarService,
    protected windowService: HostWindowService,
  ) {
    this.recentSubmissionspageSize = this.appConfig.homePage.recentSubmissions.pageSize;
    this.showDiscoverFilters = this.appConfig.homePage.showDiscoverFilters;
  }

  ngOnInit(): void {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
    this.site$ = this.route.data.pipe(
      map((data) => data.site as Site),
    );
  }
}
