import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest as observableCombineLatest, Observable, of as observableOf } from 'rxjs';
import { Bitstream } from '../../core/shared/bitstream.model';
import { RemoteData } from '../../core/data/remote-data';
import { AuthService } from '../../core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { getRemoteDataPayload } from '../../core/shared/operators';
import { HardRedirectService } from '../../core/services/hard-redirect.service';
import { GetRequest } from '../../core/data/request.models';
import { RequestService } from '../../core/data/request.service';
import {
  DOWNLOAD_TOKEN_EXPIRED_EXCEPTION,
  HTTP_STATUS_UNAUTHORIZED,
  MISSING_LICENSE_AGREEMENT_EXCEPTION
} from '../../core/shared/clarin/constants';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { hasValue, isEmpty, isNotEmpty, isNotNull, isUndefined } from '../../shared/empty.util';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { AuthrnBitstream } from '../../core/shared/clarin/bitstream-authorization.model';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FileService } from '../../core/shared/file.service';
import { getForbiddenRoute } from '../../app-routing-paths';
import { redirectOn4xx } from 'src/app/core/shared/authorized.operators';
import { hasCompleted, hasFailed, RequestEntryState } from 'src/app/core/data/request-entry-state.model';
import isEqual from 'lodash/isEqual';

/**
 * `/<BITSTREAM_UUID>/download` page
 * This component decides if the bitstream will be downloaded or if the user must fill in some user metadata or
 * if the path contains `dtoken` parameter the component tries to download the bitstream with the token.
 */
@Component({
  selector: 'ds-clarin-bitstream-download-page',
  templateUrl: './clarin-bitstream-download-page.component.html',
  styleUrls: ['./clarin-bitstream-download-page.component.scss']
})
export class ClarinBitstreamDownloadPageComponent implements OnInit {

  bitstream$: Observable<Bitstream>;
  bitstreamRD$: Observable<RemoteData<Bitstream>>;
  downloadStatus: BehaviorSubject<string> = new BehaviorSubject('');
  zipDownloadLink: BehaviorSubject<string> = new BehaviorSubject('');
  dtoken: string;

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
  ) { }

  ngOnInit(): void {
    // Get dtoken
    this.dtoken = isUndefined(this.route.snapshot.queryParams.dtoken) ? null : this.route.snapshot.queryParams.dtoken;

    if (isUndefined(this.bitstreamRD$)) {
      this.bitstreamRD$ = this.route.data.pipe(
        filter((data) => hasValue(data.bitstream)),
        map((data) => data.bitstream));
    }

    this.bitstream$ = this.bitstreamRD$.pipe(
      redirectOn4xx(this.router, this.auth),
      getRemoteDataPayload()
    );

    this.bitstream$.pipe(
      switchMap((bitstream: Bitstream) => {
        let authorizationUrl = '';
        // Get Authorization Bitstream endpoint url
        authorizationUrl = this.halService.getRootHref() + '/' + AuthrnBitstream.type.value + '/' + bitstream.uuid;

        // Add token to the url or not
        authorizationUrl = isNotEmpty(this.dtoken) ? authorizationUrl + '?dtoken=' + this.dtoken : authorizationUrl;

        const requestId = this.requestService.generateRequestId();
        const headRequest = new GetRequest(requestId, authorizationUrl);
        this.requestService.send(headRequest);

        const clarinIsAuthorized$ = this.rdbService.buildFromRequestUUID(requestId);
        // Clarin authorization will check dtoken parameter from the request
        const dtoken = isNotEmpty(this.dtoken) ? '?dtoken=' + this.dtoken : '';
        const isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanDownload, isNotEmpty(bitstream) ? bitstream.self + dtoken : undefined);
        const isLoggedIn$ = this.auth.isAuthenticated();
        return observableCombineLatest([clarinIsAuthorized$, isAuthorized$, isLoggedIn$, observableOf(bitstream)]);
      }),
      filter(([clarinIsAuthorized, isAuthorized, isLoggedIn, bitstream]: [RemoteData<any>, boolean, boolean, Bitstream]) => hasValue(isAuthorized) && hasValue(isLoggedIn) && hasValue(clarinIsAuthorized) && hasCompleted(clarinIsAuthorized.state)),
      take(1),
      switchMap(([clarinIsAuthorized, isAuthorized, isLoggedIn, bitstream]: [RemoteData<any>, boolean, boolean, Bitstream]) => {
        const isAuthorizedByClarin = this.processClarinAuthorization(clarinIsAuthorized);
        if (isAuthorizedByClarin && isAuthorized && isLoggedIn) {
          return this.fileService.retrieveFileDownloadLink(bitstream._links.content.href).pipe(
            filter((fileLink) => hasValue(fileLink)),
            take(1),
            map((fileLink) => {
              return [isAuthorizedByClarin, isAuthorized, isLoggedIn, bitstream, fileLink];
            }));
        } else {
          return [[isAuthorizedByClarin, isAuthorized, isLoggedIn, bitstream, '']];
        }
      })
    ).subscribe(([isAuthorizedByClarin, isAuthorized, isLoggedIn, bitstream, fileLink]: [boolean, boolean, boolean, Bitstream, string]) => {
      let bitstreamURL = bitstream._links.content.href;
      // Clarin Authorization is approving the user by token
      if (isAuthorizedByClarin) {
        if (fileLink.includes('authentication-token')) {
          fileLink = isNotNull(this.dtoken) ? fileLink + '&dtoken=' + this.dtoken : fileLink;
        } else {
          fileLink = isNotNull(this.dtoken) ? fileLink + '?dtoken=' + this.dtoken : fileLink;
        }
        bitstreamURL = isNotNull(this.dtoken) ? bitstreamURL + '?dtoken=' + this.dtoken : bitstreamURL;
      }
      if (isNotEmpty(this.zipDownloadLink.getValue())) {
        const authToken = fileLink.substring(fileLink.indexOf('authentication-token'));
        const currentZipDownloadLink = this.zipDownloadLink.getValue();
        const separator = currentZipDownloadLink.includes('?') ? '&' : '?';
        fileLink = currentZipDownloadLink + separator + authToken;
        bitstreamURL = this.zipDownloadLink.getValue();
      }
      // fileLink = 'http://localhost:8080/server/api/core/bitstreams/d9a41f84-a470-495a-8821-20e0a18e9276/content';
      // bitstreamURL = 'http://localhost:8080/server/api/core/bitstreams/d9a41f84-a470-495a-8821-20e0a18e9276/content';
      if ((isAuthorized || isAuthorizedByClarin) && isLoggedIn && isNotEmpty(fileLink)) {
        this.downloadStatus.next(RequestEntryState.Success);
        window.location.replace(fileLink);
      } else if ((isAuthorized || isAuthorizedByClarin) && !isLoggedIn) {
        this.downloadStatus.next(RequestEntryState.Success);
        window.location.replace(bitstreamURL);
      } else if (!(isAuthorized || isAuthorizedByClarin) && isLoggedIn &&
        this.downloadStatus.value === RequestEntryState.Error) {
        // this.downloadStatus is `ERROR` - no CLARIN exception is thrown up
        this.downloadStatus.next(HTTP_STATUS_UNAUTHORIZED.toString());
        this.router.navigateByUrl(getForbiddenRoute(), {skipLocationChange: true});
      } else if (!(isAuthorized || isAuthorizedByClarin) && !isLoggedIn && isEmpty(this.downloadStatus.value)) {
        this.auth.setRedirectUrl(this.router.url);
        this.router.navigateByUrl('login');
      }
    });
  }

  /**
   * Check if the response contains error: MissingLicenseAgreementException or DownloadTokenExpiredException and
   * show components.
   */
  processClarinAuthorization(requestEntry: RemoteData<any>) {
    if (isEqual(requestEntry?.statusCode, 200)) {
      // User is authorized -> start downloading
      this.downloadStatus.next(RequestEntryState.Success);
      return true;
    } else if (hasFailed(requestEntry.state)) {
      // User is not authorized
      if (requestEntry?.statusCode === HTTP_STATUS_UNAUTHORIZED) {
        switch (requestEntry?.errorMessage) {
          case MISSING_LICENSE_AGREEMENT_EXCEPTION:
            // Show License Agreement page with required user data for the current license
            this.downloadStatus.next(MISSING_LICENSE_AGREEMENT_EXCEPTION);
            return false;
          case DOWNLOAD_TOKEN_EXPIRED_EXCEPTION:
            // Token is expired or wrong -> try to download without token
            this.downloadStatus.next(DOWNLOAD_TOKEN_EXPIRED_EXCEPTION);
            return false;
          default:
            return false;
        }
      }
      // Another failure reason show error page
      this.downloadStatus.next(RequestEntryState.Error);
      return false;
    }
  }
}
