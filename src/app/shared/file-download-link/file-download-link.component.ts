import {
  AsyncPipe,
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
} from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import {
  getBitstreamDownloadRoute,
  getBitstreamDownloadWithAccessTokenRoute,
  getBitstreamRequestACopyRoute,
} from '@dspace/core/router/utils/dso-route.utils';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { Item } from '@dspace/core/shared/item.model';
import { ItemRequest } from '@dspace/core/shared/item-request.model';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { ThemedAccessStatusBadgeComponent } from '../object-collection/shared/badges/access-status-badge/themed-access-status-badge.component';

@Component({
  selector: 'ds-base-file-download-link',
  templateUrl: './file-download-link.component.html',
  styleUrls: ['./file-download-link.component.scss'],
  imports: [
    AsyncPipe,
    NgClass,
    NgTemplateOutlet,
    RouterLink,
    ThemedAccessStatusBadgeComponent,
    TranslateModule,
  ],
})
/**
 * Component displaying a download link
 * When the user is authenticated, a short-lived token retrieved from the REST API is added to the download link,
 * ensuring the user is authorized to download the file.
 */
export class FileDownloadLinkComponent implements OnInit {

  /**
   * Optional bitstream instead of href and file name
   */
  @Input() bitstream: Bitstream;

  @Input() item: Item;

  /**
   * Additional css classes to apply to link
   */
  @Input() cssClasses = '';

  /**
   * A boolean representing if link is shown in same tab or in a new one.
   */
  @Input() isBlank = false;

  @Input() enableRequestACopy = true;

  /**
   * A boolean indicating whether the access status badge is displayed
   */
  @Input() showAccessStatusBadge = true;

  /**
   * A boolean indicating whether the download icon should be displayed.
   */
  @Input() showIcon = false;

  itemRequest: ItemRequest;

  bitstreamPath$: Observable<{
    routerLink: string,
    queryParams: any,
  }>;

  canDownload$: Observable<boolean>;
  canDownloadWithToken$: Observable<boolean>;
  canRequestACopy$: Observable<boolean>;

  constructor(
    private authorizationService: AuthorizationDataService,
    public dsoNameService: DSONameService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    if (this.enableRequestACopy) {
      // Obtain item request data from the route snapshot
      this.itemRequest = this.route.snapshot.data.itemRequest;
      // Set up observable to evaluate access rights for a normal download
      this.canDownload$ = this.authorizationService.isAuthorized(FeatureID.CanDownload, isNotEmpty(this.bitstream) ? this.bitstream.self : undefined);
      // Only set up and execute other observables if canDownload emits false
      this.bitstreamPath$ = this.canDownload$.pipe(
        switchMap(canDownload => {
          if (canDownload) {
            return of(this.getBitstreamDownloadPath());
          }
          // Set up and combine observables to evaluate access rights to a valid token download and the request-a-copy feature
          this.canDownloadWithToken$ = of((this.itemRequest && this.itemRequest.acceptRequest && !this.itemRequest.accessExpired) ? (this.itemRequest.allfiles !== false || this.itemRequest.bitstreamId === this.bitstream.uuid) : false);
          this.canRequestACopy$ = this.authorizationService.isAuthorized(FeatureID.CanRequestACopy, isNotEmpty(this.bitstream) ? this.bitstream.self : undefined);
          // Set up canDownload observable so the template can read the state
          this.canDownload$ = of(false);
          return observableCombineLatest([this.canDownloadWithToken$, this.canRequestACopy$]).pipe(
            map(([canDownloadWithToken, canRequestACopy]) => this.getBitstreamPathForRequestACopy(canDownloadWithToken, canRequestACopy)),
          );
        }),
      );
    } else {
      this.bitstreamPath$ = of(this.getBitstreamDownloadPath());
      // TODO: do we really want this to be true always?
      this.canDownload$ = of(true);
    }
  }

  /**
   * Return a path to the bitstream based on what kind of access and authorization the user has, and whether
   * they may request a copy
   *
   * @param canDownloadWithToken user can download using a token granted by a request approver
   * @param canRequestACopy user can request approval to access a copy
   */
  getBitstreamPathForRequestACopy(canDownloadWithToken: boolean, canRequestACopy: boolean) {
    //  if the access token is valid, use this
    if (canDownloadWithToken) {
      return this.getAccessByTokenBitstreamPath(this.itemRequest);
    }
    // If the user can't download, but can request a copy, show the request a copy link
    if (canRequestACopy && hasValue(this.item)) {
      return getBitstreamRequestACopyRoute(this.item, this.bitstream);
    }
    // By default, return the plain path
    return this.getBitstreamDownloadPath();
  }

  /**
   * Resolve special bitstream path which includes access token parameter
   * @param itemRequest the item request object
   */
  getAccessByTokenBitstreamPath(itemRequest: ItemRequest) {
    return getBitstreamDownloadWithAccessTokenRoute(this.bitstream, itemRequest.accessToken);
  }

  /**
   * Get normal bitstream download path, with no parameters
   */
  getBitstreamDownloadPath() {
    return {
      routerLink: getBitstreamDownloadRoute(this.bitstream),
      queryParams: {},
    };
  }

  getDownloadLinkTitle(canDownload: boolean,canDownloadWithToken: boolean, bitstreamName: string): string {
    return (canDownload || canDownloadWithToken ? this.translateService.instant('file-download-link.download') :
      this.translateService.instant('file-download-link.request-copy')) + bitstreamName;
  }
}
