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
  recentSubmissionspageSize: number;
  /**
   * An array of LinkDefinition objects representing inbox links for the home page.
   */
  inboxLinks: LinkDefinition[] = [];

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private route: ActivatedRoute,
    private responseService: ServerResponseService,
    private notifyInfoService: NotifyInfoService,
    protected linkHeadService: LinkHeadService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    this.recentSubmissionspageSize = environment.homePage.recentSubmissions.pageSize;
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
