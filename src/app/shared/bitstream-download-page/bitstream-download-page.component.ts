import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { hasValue, isNotEmpty } from '../empty.util';
import { getRemoteDataPayload, redirectOn4xx } from '../../core/shared/operators';
import { Bitstream } from '../../core/shared/bitstream.model';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { AuthService } from '../../core/auth/auth.service';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { FileService } from '../../core/shared/file.service';
import { HardRedirectService } from '../../core/services/hard-redirect.service';
import { getForbiddenRoute } from '../../app-routing-paths';
import { RemoteData } from '../../core/data/remote-data';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
  selector: 'ds-bitstream-download-page',
  templateUrl: './bitstream-download-page.component.html'
})
/**
 * Page component for downloading a bitstream
 */
export class BitstreamDownloadPageComponent implements OnInit, OnDestroy {

  bitstream$: Observable<Bitstream>;
  bitstreamRD$: Observable<RemoteData<Bitstream>>;

  subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    private authorizationService: AuthorizationDataService,
    private auth: AuthService,
    private fileService: FileService,
    private hardRedirectService: HardRedirectService,
  ) {

  }

  ngOnInit(): void {

    this.bitstreamRD$ = this.route.data.pipe(
      map((data) => data.bitstream));

    this.bitstream$ = this.bitstreamRD$.pipe(
      tap((v) => console.log('dfdf', v)),
      redirectOn4xx(this.router, this.auth),
      getRemoteDataPayload()
    );

    this.subs.push(this.bitstream$.subscribe((bitstream) => {
      const isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanDownload, isNotEmpty(bitstream) ? bitstream.self : undefined);
      const isLoggedIn$ = this.auth.isAuthenticated();

      this.subs.push(observableCombineLatest(isAuthorized$, isLoggedIn$)
        .subscribe(([isAuthorized, isLoggedIn]) => {
          if (isAuthorized && isLoggedIn) {
            const fileLink$ = this.fileService.downloadFile(bitstream._links.content.href);
            this.subs.push(fileLink$.subscribe((fileLink) => {
              this.hardRedirectService.redirect(fileLink);
            }));
          } else if (isAuthorized && !isLoggedIn) {
            this.hardRedirectService.redirect(bitstream._links.content.href);
          } else if (!isAuthorized && isLoggedIn) {
            this.router.navigateByUrl(getForbiddenRoute(), {skipLocationChange: true});
          } else if (!isAuthorized && !isLoggedIn) {
            this.auth.setRedirectUrl(this.router.url);
            this.router.navigateByUrl('login');
          }
        }));
    }));

  }

  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
