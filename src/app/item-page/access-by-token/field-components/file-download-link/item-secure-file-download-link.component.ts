import {
  AsyncPipe,
  NgClass,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of as observableOf,
} from 'rxjs';
import { map } from 'rxjs/operators';

import {
  getBitstreamDownloadRoute,
  getBitstreamDownloadWithAccessTokenRoute,
  getBitstreamRequestACopyRoute,
} from '../../../../app-routing-paths';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { ItemRequest } from '../../../../core/shared/item-request.model';
import {
  hasValue,
  isNotEmpty,
} from '../../../../shared/empty.util';

@Component({
  selector: 'ds-item-secure-file-download-link',
  templateUrl: './item-secure-file-download-link.component.html',
  styleUrls: ['./item-secure-file-download-link.component.scss'],
  standalone: true,
  imports: [
    RouterLink, NgClass, NgIf, NgTemplateOutlet, AsyncPipe, TranslateModule,
  ],
})
/**
 * Component displaying a download link
 * When the user is authenticated, a short-lived token retrieved from the REST API is added to the download link,
 * ensuring the user is authorized to download the file.
 */
export class ItemSecureFileDownloadLinkComponent implements OnInit {

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

  @Input() itemRequest: ItemRequest;

  @Input() enableRequestACopy = true;

  bitstreamPath$: Observable<{
    routerLink: string,
    queryParams: any,
  }>;

  // authorized to download normally
  canDownload$: Observable<boolean>;
  // authorized to download with token
  canDownloadWithToken$: Observable<boolean>;
  // authorized to request a copy
  canRequestACopy$: Observable<boolean>;

  constructor(
    private authorizationService: AuthorizationDataService,
  ) {
  }

  /**
   * Initialise component observables to test access rights to a normal bitstream download, a valid token download
   * (for a given bitstream), and ability to request a copy of a bitstream.
   */
  ngOnInit() {
    this.canDownload$ = this.authorizationService.isAuthorized(FeatureID.CanDownload, isNotEmpty(this.bitstream) ? this.bitstream.self : undefined);
    this.canDownloadWithToken$ = observableOf(this.itemRequest ? (this.itemRequest.allfiles !== false || this.itemRequest.bitstreamId === this.bitstream.uuid) : false);
    this.canRequestACopy$ = this.authorizationService.isAuthorized(FeatureID.CanRequestACopy, isNotEmpty(this.bitstream) ? this.bitstream.self : undefined);

    this.bitstreamPath$ = observableCombineLatest([this.canDownload$, this.canDownloadWithToken$, this.canRequestACopy$]).pipe(
      map(([canDownload, canDownloadWithToken, canRequestACopy]) => this.getBitstreamPath(canDownload, canDownloadWithToken, canRequestACopy)),
    );
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
}
