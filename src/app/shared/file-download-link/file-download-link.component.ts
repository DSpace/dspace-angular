import { Component, Input, OnInit } from '@angular/core';
import { Bitstream } from '../../core/shared/bitstream.model';
import { getBitstreamDownloadRoute, getBitstreamRequestACopyRoute } from '../../app-routing-paths';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { hasValue, isNotEmpty } from '../empty.util';
import { catchError, map } from 'rxjs/operators';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, shareReplay } from 'rxjs';
import { Item } from '../../core/shared/item.model';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from 'src/app/core/shared/operators';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';

@Component({
  selector: 'ds-file-download-link',
  templateUrl: './file-download-link.component.html',
  styleUrls: ['./file-download-link.component.scss']
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

  @Input() showIcon = false;

  bitstreamPath$: Observable<{
    routerLink: string,
    queryParams: any,
  }>;

  canDownload$: Observable<boolean>;

  /**
   * Whether or not the user can request a copy of the item
   * based on the configuration property `request.item.type`.
   */
    public canRequestItemCopy$: Observable<boolean>;


  constructor(
    private authorizationService: AuthorizationDataService,
    private configurationService: ConfigurationDataService,
    public dsoNameService: DSONameService,
  ) {
  }

  ngOnInit() {
    if (this.enableRequestACopy) {
      this.canDownload$ = this.authorizationService.isAuthorized(FeatureID.CanDownload, isNotEmpty(this.bitstream) ? this.bitstream.self : undefined);
      const canRequestACopy$ = this.authorizationService.isAuthorized(FeatureID.CanRequestACopy, isNotEmpty(this.bitstream) ? this.bitstream.self : undefined);
      this.bitstreamPath$ = observableCombineLatest([this.canDownload$, canRequestACopy$]).pipe(
        map(([canDownload, canRequestACopy]) => this.getBitstreamPath(canDownload, canRequestACopy))
      );

      this.canRequestItemCopy$ = this.configurationService.findByPropertyName('request.item.type').pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload(),
        map((requestItemType: ConfigurationProperty) =>
        // in case requestItemType empty/commented out(undefined) - request-copy not allowed
            hasValue(requestItemType) && requestItemType.values.length > 0
        ),
        catchError(() => observableOf(false)),
        shareReplay(1)
      );
    } else {
      this.bitstreamPath$ = observableOf(this.getBitstreamDownloadPath());
      this.canDownload$ = observableOf(true);
      this.canRequestItemCopy$ = observableOf(false);
    }
  }

  getBitstreamPath(canDownload: boolean, canRequestACopy: boolean) {
    if (!canDownload && canRequestACopy && hasValue(this.item)) {
      return getBitstreamRequestACopyRoute(this.item, this.bitstream);
    }
    return this.getBitstreamDownloadPath();
  }

  getBitstreamDownloadPath() {
    return {
      routerLink: getBitstreamDownloadRoute(this.bitstream),
      queryParams: {}
    };
  }
}
