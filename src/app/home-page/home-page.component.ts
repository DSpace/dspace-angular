import {
  AsyncPipe,
  isPlatformServer,
  NgClass,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Site } from '../core/shared/site.model';
import { isPlatformServer } from '@angular/common';
import { ServerResponseService } from '../core/services/server-response.service';
import { TranslateModule } from '@ngx-translate/core';
import {
  EMPTY,
  Observable,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';
import {
  APP_CONFIG,
  AppConfig,
} from 'src/config/app-config.interface';

import { environment } from '../../environments/environment';
import { NotifyInfoService } from '../core/coar-notify/notify-info/notify-info.service';
import {
  LinkDefinition,
  LinkHeadService,
} from '../core/services/link-head.service';
import { ServerResponseService } from '../core/services/server-response.service';
import { Site } from '../core/shared/site.model';
import { SuggestionsPopupComponent } from '../notifications/suggestions-popup/suggestions-popup.component';
import { ConfigurationSearchPageComponent } from '../search-page/configuration-search-page.component';
import { isNotEmpty } from '../shared/empty.util';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
import { HostWindowService } from '../shared/host-window.service';
import { SidebarService } from '../shared/sidebar/sidebar.service';

import { ThemedSearchFormComponent } from '../shared/search-form/themed-search-form.component';
import { ViewTrackerComponent } from '../statistics/angulartics/dspace/view-tracker.component';
import { ThemedHomeNewsComponent } from './home-news/themed-home-news.component';
import { RecentItemListComponent } from './recent-item-list/recent-item-list.component';
import { ThemedTopLevelCommunityListComponent } from './top-level-community-list/themed-top-level-community-list.component';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [ThemedHomeNewsComponent, NgIf, ViewTrackerComponent, ThemedSearchFormComponent, ThemedTopLevelCommunityListComponent, RecentItemListComponent, AsyncPipe, TranslateModule, NgClass, ConfigurationSearchPageComponent, SuggestionsPopupComponent],
})
export class HomePageComponent implements OnInit, OnDestroy {

  site$: Observable<Site>;
  isXsOrSm$: Observable<boolean>;
  recentSubmissionspageSize: number;
  showDiscoverFilters: boolean;
  /**
   * An array of LinkDefinition objects representing inbox links for the home page.
   */
  inboxLinks: LinkDefinition[] = [];

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected route: ActivatedRoute,
    protected responseService: ServerResponseService,
    protected notifyInfoService: NotifyInfoService,
    protected linkHeadService: LinkHeadService,
    @Inject(PLATFORM_ID) private platformId: string,
    protected sidebarService: SidebarService,
    protected windowService: HostWindowService,
    @Inject(PLATFORM_ID) protected platformId: string,
  ) {
    this.recentSubmissionspageSize = this.appConfig.homePage.recentSubmissions.pageSize;
    this.showDiscoverFilters = this.appConfig.homePage.showDiscoverFilters;
    // Get COAR REST API URLs from REST configuration
    // only if COAR configuration is enabled
    this.notifyInfoService.isCoarConfigEnabled().pipe(
      switchMap((coarLdnEnabled: boolean) => coarLdnEnabled ? this.notifyInfoService.getCoarLdnLocalInboxUrls() : EMPTY, /*{
        if (coarLdnEnabled) {
          return this.notifyInfoService.getCoarLdnLocalInboxUrls();
        } else {
          return of([]);
        }
      }*/),
    ).subscribe((coarRestApiUrls: string[]) => {
      if (coarRestApiUrls?.length > 0) {
        this.initPageLinks(coarRestApiUrls);
      }
    });
  }

  ngOnInit(): void {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
    this.site$ = this.route.data.pipe(
      map((data) => data.site as Site),
    );
  }

  /**
   * Initializes page links for COAR REST API URLs.
   * @param coarRestApiUrls An array of COAR REST API URLs.
   */
  private initPageLinks(coarRestApiUrls: string[]): void {
    const rel = this.notifyInfoService.getInboxRelationLink();
    let links = '';
    coarRestApiUrls.forEach((coarRestApiUrl: string) => {
      // Add link to head
      const tag: LinkDefinition = {
        href: coarRestApiUrl,
        rel: rel,
      };
      this.inboxLinks.push(tag);
      this.linkHeadService.addTag(tag);

      links = links + (isNotEmpty(links) ? ', ' : '') + `<${coarRestApiUrl}> ; rel="${rel}"`;
    });

    if (isPlatformServer(this.platformId)) {
      // Add link to response header
      this.responseService.setHeader('Link', links);
    }
  }

  /**
   * It removes the inbox links from the head of the html.
   */
  ngOnDestroy(): void {
    this.inboxLinks.forEach((link: LinkDefinition) => {
      this.linkHeadService.removeTag(`href='${link.href}'`);
    });
  }
}
