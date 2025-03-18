import {
  AsyncPipe,
  isPlatformServer,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
  take,
} from 'rxjs/operators';
import { NotifyInfoService } from 'src/app/core/coar-notify/notify-info/notify-info.service';

import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { ItemDataService } from '../../core/data/item-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { SignpostingDataService } from '../../core/data/signposting-data.service';
import { SignpostingLink } from '../../core/data/signposting-links.model';
import {
  LinkDefinition,
  LinkHeadService,
} from '../../core/services/link-head.service';
import { ServerResponseService } from '../../core/services/server-response.service';
import { Item } from '../../core/shared/item.model';
import { getAllSucceededRemoteDataPayload } from '../../core/shared/operators';
import { ViewMode } from '../../core/shared/view-mode.model';
import { fadeInOut } from '../../shared/animations/fade';
import { isNotEmpty } from '../../shared/empty.util';
import { ErrorComponent } from '../../shared/error/error.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { ListableObjectComponentLoaderComponent } from '../../shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { VarDirective } from '../../shared/utils/var.directive';
import { ViewTrackerComponent } from '../../statistics/angulartics/dspace/view-tracker.component';
import { ThemedItemAlertsComponent } from '../alerts/themed-item-alerts.component';
import { getItemPageRoute } from '../item-page-routing-paths';
import { ItemVersionsComponent } from '../versions/item-versions.component';
import { ItemVersionsNoticeComponent } from '../versions/notice/item-versions-notice.component';
import { NotifyRequestsStatusComponent } from './notify-requests-status/notify-requests-status-component/notify-requests-status.component';
import { QaEventNotificationComponent } from './qa-event-notification/qa-event-notification.component';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({
  selector: 'ds-base-item-page',
  styleUrls: ['./item-page.component.scss'],
  templateUrl: './item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
  standalone: true,
  imports: [
    VarDirective,
    ThemedItemAlertsComponent,
    ItemVersionsNoticeComponent,
    ViewTrackerComponent,
    ListableObjectComponentLoaderComponent,
    ItemVersionsComponent,
    ErrorComponent,
    ThemedLoadingComponent,
    TranslateModule,
    AsyncPipe,
    NgIf,
    NotifyRequestsStatusComponent,
    QaEventNotificationComponent,
  ],
})
export class ItemPageComponent implements OnInit, OnDestroy {

  /**
   * The item's id
   */
  id: number;

  /**
   * The item wrapped in a remote-data object
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * The view-mode we're currently on
   */
  viewMode = ViewMode.StandalonePage;

  /**
   * Route to the item's page
   */
  itemPageRoute$: Observable<string>;

  /**
   * Whether the current user is an admin or not
   */
  isAdmin$: Observable<boolean>;

  itemUrl: string;

  /**
   * Contains a list of SignpostingLink related to the item
   */
  signpostingLinks: SignpostingLink[] = [];

  /**
   * An array of LinkDefinition objects representing inbox links for the item page.
   */
  inboxTags: LinkDefinition[] = [];

  coarRestApiUrls: string[] = [];

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected items: ItemDataService,
    protected authorizationService: AuthorizationDataService,
    protected responseService: ServerResponseService,
    protected signpostingDataService: SignpostingDataService,
    protected linkHeadService: LinkHeadService,
    protected notifyInfoService: NotifyInfoService,
    @Inject(PLATFORM_ID) protected platformId: string,
  ) {
    this.initPageLinks();
  }

  /**
   * Initialize instance variables
   */
  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Item>),
    );
    this.itemPageRoute$ = this.itemRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((item) => getItemPageRoute(item)),
    );

    this.isAdmin$ = this.authorizationService.isAuthorized(FeatureID.AdministratorOf);

  }

  /**
   * Create page links if any are retrieved by signposting endpoint
   *
   * @private
   */
  private initPageLinks(): void {
    this.route.params.subscribe(params => {
      combineLatest([this.signpostingDataService.getLinks(params.id).pipe(take(1)), this.getCoarLdnLocalInboxUrls()])
        .subscribe(([signpostingLinks, coarRestApiUrls]) => {
          let links = '';
          this.signpostingLinks = signpostingLinks;

          signpostingLinks.forEach((link: SignpostingLink) => {
            links = links + (isNotEmpty(links) ? ', ' : '') + `<${link.href}> ; rel="${link.rel}"` + (isNotEmpty(link.type) ? ` ; type="${link.type}" ` : ' ');
            let tag: LinkDefinition = {
              href: link.href,
              rel: link.rel,
            };
            if (isNotEmpty(link.type)) {
              tag = Object.assign(tag, {
                type: link.type,
              });
            }
            this.linkHeadService.addTag(tag);
          });

          if (coarRestApiUrls.length > 0) {
            const inboxLinks = this.initPageInboxLinks(coarRestApiUrls);
            links = links + (isNotEmpty(links) ? ', ' : '') + inboxLinks;
          }

          if (isPlatformServer(this.platformId)) {
            this.responseService.setHeader('Link', links);
          }
        });
    });
  }

  /**
   * Sets the COAR LDN local inbox URL if COAR configuration is enabled.
   * If the COAR LDN local inbox URL is retrieved successfully, initializes the page inbox links.
   */
  private getCoarLdnLocalInboxUrls(): Observable<string[]> {
    return this.notifyInfoService.isCoarConfigEnabled().pipe(
      switchMap((coarLdnEnabled: boolean) => {
        if (coarLdnEnabled) {
          return this.notifyInfoService.getCoarLdnLocalInboxUrls();
        } else {
          return of([]);
        }
      }),
    );
  }

  /**
   * Initializes the page inbox links.
   * @param coarRestApiUrls - An array of COAR REST API URLs.
   */
  private initPageInboxLinks(coarRestApiUrls: string[]): string {
    const rel = this.notifyInfoService.getInboxRelationLink();
    let links = '';

    coarRestApiUrls.forEach((coarRestApiUrl: string) => {
      // Add link to head
      const tag: LinkDefinition = {
        href: coarRestApiUrl,
        rel: rel,
      };
      this.inboxTags.push(tag);
      this.linkHeadService.addTag(tag);

      links = links + (isNotEmpty(links) ? ', ' : '') + `<${coarRestApiUrl}> ; rel="${rel}"`;
    });

    return links;
  }

  ngOnDestroy(): void {
    this.signpostingLinks.forEach((link: SignpostingLink) => {
      this.linkHeadService.removeTag(`href='${link.href}'`);
    });
    this.inboxTags.forEach((link: LinkDefinition) => {
      this.linkHeadService.removeTag(`href='${link.href}'`);
    });
  }
}
