import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Site } from '../core/shared/site.model';
import { environment } from '../../environments/environment';
import { isPlatformServer } from '@angular/common';
import { ServerResponseService } from '../core/services/server-response.service';
import { NotifyInfoService } from '../core/coar-notify/notify-info/notify-info.service';
import { LinkDefinition, LinkHeadService } from '../core/services/link-head.service';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {

  site$: Observable<Site>;
  recentSubmissionspageSize: number;

  constructor(
    private route: ActivatedRoute,
    private responseService: ServerResponseService,
    private notifyInfoService: NotifyInfoService,
    protected linkHeadService: LinkHeadService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.recentSubmissionspageSize = environment.homePage.recentSubmissions.pageSize;
    this.notifyInfoService.isCoarConfigEnabled().pipe(
      switchMap((coarLdnEnabled: boolean) => {
        if (coarLdnEnabled) {
          return this.notifyInfoService.getCoarLdnLocalInboxUrl();
        }
      })
    ).subscribe((coarRestApiUrls: string[]) => {
      this.initPageLinks(coarRestApiUrls);
    });
  }

  ngOnInit(): void {
    this.site$ = this.route.data.pipe(
      map((data) => data.site as Site),
    );
  }

  private initPageLinks(coarRestApiUrls: string[]): void {
    const rel = this.notifyInfoService.getRelationLink();
    coarRestApiUrls.forEach((coarRestApiUrl: string) => {
      let tag: LinkDefinition = {
        href: coarRestApiUrl,
        rel: rel
      };
      this.linkHeadService.addTag(tag);
      if (isPlatformServer(this.platformId)) {
        this.responseService.setHeader('Link', `<${coarRestApiUrl}>; rel="${rel}"`);
      }
    });
  }
}
