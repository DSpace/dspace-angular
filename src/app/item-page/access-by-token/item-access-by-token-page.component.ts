import {
  AsyncPipe,
  KeyValuePipe,
  Location,
  NgForOf,
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
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { getForbiddenRoute } from '../../app-routing-paths';
import { AuthService } from '../../core/auth/auth.service';
import { NotifyInfoService } from '../../core/coar-notify/notify-info/notify-info.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { ItemRequestDataService } from '../../core/data/item-request-data.service';
import { SignpostingDataService } from '../../core/data/signposting-data.service';
import { LinkHeadService } from '../../core/services/link-head.service';
import { ServerResponseService } from '../../core/services/server-response.service';
import { redirectOn4xx } from '../../core/shared/authorized.operators';
import { ItemRequest } from '../../core/shared/item-request.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../core/shared/operators';
import { fadeInOut } from '../../shared/animations/fade';
import { DsoEditMenuComponent } from '../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { hasValue } from '../../shared/empty.util';
import { ErrorComponent } from '../../shared/error/error.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { MetadataFieldWrapperComponent } from '../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { ThemedResultsBackButtonComponent } from '../../shared/results-back-button/themed-results-back-button.component';
import { VarDirective } from '../../shared/utils/var.directive';
import { ViewTrackerComponent } from '../../statistics/angulartics/dspace/view-tracker.component';
import { ThemedThumbnailComponent } from '../../thumbnail/themed-thumbnail.component';
import { ThemedItemAlertsComponent } from '../alerts/themed-item-alerts.component';
import { CollectionsComponent } from '../field-components/collections/collections.component';
import { ThemedFullFileSectionComponent } from '../full/field-components/file-section/themed-full-file-section.component';
import { ThemedMediaViewerComponent } from '../media-viewer/themed-media-viewer.component';
import { MiradorViewerComponent } from '../mirador-viewer/mirador-viewer.component';
import { ThemedFileSectionComponent } from '../simple/field-components/file-section/themed-file-section.component';
import { ItemPageAbstractFieldComponent } from '../simple/field-components/specific-field/abstract/item-page-abstract-field.component';
import { ItemPageDateFieldComponent } from '../simple/field-components/specific-field/date/item-page-date-field.component';
import { GenericItemPageFieldComponent } from '../simple/field-components/specific-field/generic/generic-item-page-field.component';
import { ThemedItemPageTitleFieldComponent } from '../simple/field-components/specific-field/title/themed-item-page-field.component';
import { ItemPageUriFieldComponent } from '../simple/field-components/specific-field/uri/item-page-uri-field.component';
import { ItemPageComponent } from '../simple/item-page.component';
import { ThemedMetadataRepresentationListComponent } from '../simple/metadata-representation-list/themed-metadata-representation-list.component';
import { ItemVersionsComponent } from '../versions/item-versions.component';
import { ItemVersionsNoticeComponent } from '../versions/notice/item-versions-notice.component';
import { ItemSecureFileSectionComponent } from './field-components/file-section/item-secure-file-section.component';
import { ItemAccessByTokenViewComponent } from './item-access-by-token-view.component';

@Component({
  selector: 'ds-access-by-token-item-page',
  styleUrls: ['./item-access-by-token-page.component.scss'],
  templateUrl: './item-access-by-token-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
  standalone: true,
  imports: [
    ErrorComponent,
    ThemedLoadingComponent,
    TranslateModule,
    ThemedFullFileSectionComponent,
    CollectionsComponent,
    ItemVersionsComponent,
    NgIf,
    NgForOf,
    AsyncPipe,
    KeyValuePipe,
    RouterLink,
    ThemedItemPageTitleFieldComponent,
    DsoEditMenuComponent,
    ItemVersionsNoticeComponent,
    ViewTrackerComponent,
    ThemedItemAlertsComponent,
    VarDirective,
    ItemSecureFileSectionComponent,
    GenericItemPageFieldComponent,
    ItemPageAbstractFieldComponent,
    ItemPageDateFieldComponent,
    ItemPageUriFieldComponent,
    MetadataFieldWrapperComponent,
    MiradorViewerComponent,
    ThemedFileSectionComponent,
    ThemedMediaViewerComponent,
    ThemedMetadataRepresentationListComponent,
    ThemedResultsBackButtonComponent,
    ThemedThumbnailComponent,
    ItemAccessByTokenViewComponent,
  ],
})
export class ItemAccessByTokenPageComponent extends ItemPageComponent implements OnInit, OnDestroy {

  itemRequest$: Observable<ItemRequest>;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected items: ItemDataService,
    protected authService: AuthService,
    protected authorizationService: AuthorizationDataService,
    protected _location: Location,
    protected responseService: ServerResponseService,
    protected signpostingDataService: SignpostingDataService,
    protected linkHeadService: LinkHeadService,
    protected notifyInfoService: NotifyInfoService,
    private itemRequestDataService: ItemRequestDataService,
    @Inject(PLATFORM_ID) protected platformId: string,
  ) {
    super(route, router, items, authorizationService, responseService, signpostingDataService, linkHeadService, notifyInfoService, platformId);
  }

  protected readonly hasValue = hasValue;

  /**
   * Initialise this component
   * 1. take the access token from the query params and complete the stream
   * 2. test for access token or redirect to forbidden page
   * 3. get the sanitized token, make sure it is valid (if not, redirect to forbidden page)
   * 4. return observable to itemRequest$ for the view to subscribe to
   */
  ngOnInit(): void {
    this.itemRequest$ = this.route.queryParams.pipe(
      take(1),
      map(params => {
        if (!hasValue(params?.accessToken)) {
          this.router.navigateByUrl(getForbiddenRoute(), { skipLocationChange: false });
          return null;
        }
        return params.accessToken;
      }),
      filter(token => hasValue(token)),
      switchMap(token => this.itemRequestDataService.getSanitizedRequestByAccessToken(token)),
      getFirstCompletedRemoteData(),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload(),
      tap(request => {
        if (!hasValue(request)) {
          this.router.navigateByUrl(getForbiddenRoute());
        }
      }),
    );

    // Call item page component initialization.
    super.ngOnInit();
  }

  /**
   * Navigate back in browser history.
   */
  back() {
    this._location.back();
  }

}

