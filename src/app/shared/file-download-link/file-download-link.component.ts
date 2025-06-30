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
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';

import {
  getBitstreamDownloadRoute,
  getBitstreamDownloadWithAccessTokenRoute,
  getBitstreamRequestACopyRoute,
} from '../../app-routing-paths';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { Bitstream } from '../../core/shared/bitstream.model';
import { Item } from '../../core/shared/item.model';
import { ItemRequest } from '../../core/shared/item-request.model';
import {
  hasValue,
  isNotEmpty,
} from '../empty.util';
import { ThemedAccessStatusBadgeComponent } from '../object-collection/shared/badges/access-status-badge/themed-access-status-badge.component';

@Component({
  selector: 'ds-base-file-download-link',
  templateUrl: './file-download-link.component.html',
  styleUrls: ['./file-download-link.component.scss'],
  standalone: true,
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
      // Set up observables to test access rights to a normal bitstream download, a valid token download, and the request-a-copy feature
      this.canDownload$ = this.authorizationService.isAuthorized(FeatureID.CanDownload, isNotEmpty(this.bitstream) ? this.bitstream.self : undefined);
      this.canDownloadWithToken$ = of((this.itemRequest && this.itemRequest.acceptRequest && !this.itemRequest.accessExpired) ? (this.itemRequest.allfiles !== false || this.itemRequest.bitstreamId === this.bitstream.uuid) : false);
      this.canRequestACopy$ = this.authorizationService.isAuthorized(FeatureID.CanRequestACopy, isNotEmpty(this.bitstream) ? this.bitstream.self : undefined);
      // Set up observable to determine the path to the bitstream based on the user's access rights and features as above
      this.bitstreamPath$ = observableCombineLatest([this.canDownload$, this.canDownloadWithToken$, this.canRequestACopy$]).pipe(
        map(([canDownload, canDownloadWithToken, canRequestACopy]) => this.getBitstreamPath(canDownload, canDownloadWithToken, canRequestACopy)),
      );
    } else {
      this.bitstreamPath$ = of(this.getBitstreamDownloadPath());
      this.canDownload$ = of(true);
    }
  }

  /**
   * Return a path to the bitstream based on what kind of access and authorization the user has, and whether
   * they may request a copy
   *
   * @param canDownload user can download normally
   * @param canDownloadWithToken user can download using a token granted by a request approver
   * @param canRequestACopy user can request approval to access a copy
   */
  getBitstreamPath(canDownload: boolean, canDownloadWithToken, canRequestACopy: boolean) {
    // No matter what, if the user can download with their own authZ, allow it
    if (canDownload) {
      return this.getBitstreamDownloadPath();
    }
    // Otherwise, if they access token is valid, use this
    if (canDownloadWithToken) {
      return this.getAccessByTokenBitstreamPath(this.itemRequest);
    }
    // If the user can't download, but can request a copy, show the request a copy link
    if (!canDownload && canRequestACopy && hasValue(this.item)) {
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
