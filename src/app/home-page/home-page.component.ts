import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Site } from '../core/shared/site.model';
import { environment } from '../../environments/environment';
import { isPlatformServer } from '@angular/common';
import { ServerResponseService } from '../core/services/server-response.service';
import { NotifyInfoService } from '../core/coar-notify/notify-info/notify-info.service';
import { LinkDefinition, LinkHeadService } from '../core/services/link-head.service';
import { isNotEmpty } from '../shared/empty.util';

import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
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
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.recentSubmissionspageSize = environment.homePage.recentSubmissions.pageSize;
    // Get COAR REST API URLs from REST configuration
    // only if COAR configuration is enabled
    this.notifyInfoService.isCoarConfigEnabled().pipe(
      switchMap((coarLdnEnabled: boolean) => {
        if (coarLdnEnabled) {
          return this.notifyInfoService.getCoarLdnLocalInboxUrls();
        }
      })
    ).subscribe((coarRestApiUrls: string[]) => {
      if (coarRestApiUrls.length > 0) {
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
      let tag: LinkDefinition = {
        href: coarRestApiUrl,
        rel: rel
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
