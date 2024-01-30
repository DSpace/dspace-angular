import { Component, OnInit } from '@angular/core';
import { ClarinBitstreamDownloadPageComponent } from '../clarin-bitstream-download-page/clarin-bitstream-download-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { HardRedirectService } from '../../core/services/hard-redirect.service';
import { RequestService } from '../../core/data/request.service';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { FileService } from '../../core/shared/file.service';
import { map } from 'rxjs/operators';
import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bitstream } from '../../core/shared/bitstream.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { hasValue } from '../../shared/empty.util';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Fetch ZIP file from the server as a single file into `bitstreamRD$` property which is extended and then call
 * `super.ngOnInit()` to continue the parent process.
 */
@Component({
  selector: 'ds-clarin-zip-download-page',
  templateUrl: '../clarin-bitstream-download-page/clarin-bitstream-download-page.component.html',
  styleUrls: ['../clarin-bitstream-download-page/clarin-bitstream-download-page.component.scss']
})
export class ClarinZipDownloadPageComponent extends ClarinBitstreamDownloadPageComponent implements OnInit {
  itemRD$: Observable<RemoteData<Item>>;
  bitstreams$: BehaviorSubject<Bitstream[]> = new BehaviorSubject<Bitstream[]>([]);

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected auth: AuthService,
    protected authorizationService: AuthorizationDataService,
    protected hardRedirectService: HardRedirectService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected halService: HALEndpointService,
    protected fileService: FileService,
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService,
    protected notificationsService: NotificationsService
  ) {
    super(route, router, auth, authorizationService, hardRedirectService, requestService, rdbService, halService,
      fileService);
  }

  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(
      map((data) => data.dso));

    this.itemRD$.subscribe((itemRD: RemoteData<Item>)  => {
      this.bitstreamDataService.findAllByItemAndBundleName(itemRD?.payload, 'ORIGINAL', {
        currentPage: 1,
        elementsPerPage: 9999
      }).pipe(
        getFirstCompletedRemoteData(),
      ).subscribe((bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) => {
        if (bitstreamsRD.errorMessage) {
          this.notificationsService.error(this.translateService.get('file-section.error.header'),
            `${bitstreamsRD.statusCode} ${bitstreamsRD.errorMessage}`);
        } else if (hasValue(bitstreamsRD.payload)) {
          const current: Bitstream[] = this.bitstreams$.getValue();
          this.bitstreams$.next([...current, ...bitstreamsRD.payload.page]);
          this.bitstreamRD$ = createSuccessfulRemoteDataObject$(this.bitstreams$.getValue()[0]);
          this.zipDownloadLink.next(this.halService.getRootHref() +
            `/core/items/${itemRD.payload.uuid}/allzip?handleId=${itemRD?.payload?.handle}`);
          super.ngOnInit();
        }
      });
    });
  }
}
