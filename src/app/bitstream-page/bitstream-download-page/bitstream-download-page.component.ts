import {
  AsyncPipe,
  isPlatformServer,
  Location,
} from '@angular/common';
import {
  Component,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  ActivatedRoute,
  Params,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { getForbiddenRoute } from '../../app-routing-paths';
import { AuthService } from '../../core/auth/auth.service';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { RemoteData } from '../../core/data/remote-data';
import { SignpostingDataService } from '../../core/data/signposting-data.service';
import { SignpostingLink } from '../../core/data/signposting-links.model';
import { HardRedirectService } from '../../core/services/hard-redirect.service';
import { ServerResponseService } from '../../core/services/server-response.service';
import { redirectOn4xx } from '../../core/shared/authorized.operators';
import { Bitstream } from '../../core/shared/bitstream.model';
import { FileService } from '../../core/shared/file.service';
import { getRemoteDataPayload } from '../../core/shared/operators';
import {
  hasValue,
  isNotEmpty,
} from '../../shared/empty.util';
import { MatomoService } from '../../statistics/matomo.service';

@Component({
  selector: 'ds-bitstream-download-page',
  templateUrl: './bitstream-download-page.component.html',
  imports: [
    AsyncPipe,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * Page component for downloading a bitstream
 */
export class BitstreamDownloadPageComponent implements OnInit {

  bitstream$: Observable<Bitstream>;
  bitstreamRD$: Observable<RemoteData<Bitstream>>;

  configService = inject(ConfigurationDataService);

  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    private authorizationService: AuthorizationDataService,
    private auth: AuthService,
    private fileService: FileService,
    private hardRedirectService: HardRedirectService,
    private location: Location,
    public dsoNameService: DSONameService,
    private signpostingDataService: SignpostingDataService,
    private responseService: ServerResponseService,
    private matomoService: MatomoService,
    @Inject(PLATFORM_ID) protected platformId: string,
  ) {
    this.initPageLinks();
  }

  back(): void {
    this.location.back();
  }

  ngOnInit(): void {
    const accessToken$: Observable<string> = this.route.queryParams.pipe(
      map((queryParams: Params) => queryParams?.accessToken || null),
      take(1),
    );

    this.bitstreamRD$ = this.route.data.pipe(
      map((data) => data.bitstream));

    this.bitstream$ = this.bitstreamRD$.pipe(
      redirectOn4xx(this.router, this.auth),
      getRemoteDataPayload(),
    );

    this.bitstream$.pipe(
      switchMap((bitstream: Bitstream) => {
        const isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanDownload, isNotEmpty(bitstream) ? bitstream.self : undefined);
        const isLoggedIn$ = this.auth.isAuthenticated();
        const isMatomoEnabled$ = this.matomoService.isMatomoEnabled$();
        return observableCombineLatest([isAuthorized$, isLoggedIn$, isMatomoEnabled$, accessToken$, of(bitstream)]);
      }),
      filter(([isAuthorized, isLoggedIn, isMatomoEnabled, accessToken, bitstream]: [boolean, boolean, boolean, string, Bitstream]) => (hasValue(isAuthorized) && hasValue(isLoggedIn)) || hasValue(accessToken)),
      take(1),
      switchMap(([isAuthorized, isLoggedIn, isMatomoEnabled, accessToken, bitstream]: [boolean, boolean, boolean, string, Bitstream]) => {
        if (isAuthorized && isLoggedIn) {
          return this.fileService.retrieveFileDownloadLink(bitstream._links.content.href).pipe(
            filter((fileLink) => hasValue(fileLink)),
            take(1),
            map((fileLink) => {
              return [isAuthorized, isLoggedIn, isMatomoEnabled, bitstream, fileLink];
            }));
        } else if (hasValue(accessToken)) {
          return [[isAuthorized, !isLoggedIn, isMatomoEnabled, bitstream, '', accessToken]];
        } else {
          return [[isAuthorized, isLoggedIn, isMatomoEnabled, bitstream, bitstream._links.content.href]];
        }
      }),
      switchMap(([isAuthorized, isLoggedIn, isMatomoEnabled, bitstream, fileLink, accessToken]: [boolean, boolean, boolean, Bitstream, string, string]) => {
        if (isMatomoEnabled) {
          return this.matomoService.appendVisitorId(fileLink).pipe(
            map((fileLinkWithVisitorId) => [isAuthorized, isLoggedIn, bitstream, fileLinkWithVisitorId, accessToken]),
          );
        }
        return of([isAuthorized, isLoggedIn, bitstream, fileLink, accessToken]);
      }),
    ).subscribe(([isAuthorized, isLoggedIn, bitstream, fileLink, accessToken]: [boolean, boolean, Bitstream, string, string]) => {
      if (isAuthorized && isLoggedIn && isNotEmpty(fileLink)) {
        this.hardRedirectService.redirect(fileLink);
      } else if (isAuthorized && !isLoggedIn && !hasValue(accessToken)) {
        this.hardRedirectService.redirect(fileLink);
      } else if (!isAuthorized) {
        // Either we have an access token, or we are logged in, or we are not logged in.
        // For now, the access token does not care if we are logged in or not.
        if (hasValue(accessToken)) {
          this.hardRedirectService.redirect(bitstream._links.content.href + '?accessToken=' + accessToken);
        } else if (isLoggedIn) {
          this.router.navigateByUrl(getForbiddenRoute(), { skipLocationChange: true });
        } else if (!isLoggedIn) {
          this.auth.setRedirectUrl(this.router.url);
          this.router.navigateByUrl('login');
        }
      }
    });
  }

  /**
   * Create page links if any are retrieved by signposting endpoint
   *
   * @private
   */
  private initPageLinks(): void {
    if (isPlatformServer(this.platformId)) {
      this.route.params.subscribe(params => {
        this.signpostingDataService.getLinks(params.id).pipe(take(1)).subscribe((signpostingLinks: SignpostingLink[]) => {
          let links = '';

          signpostingLinks.forEach((link: SignpostingLink) => {
            links = links + (isNotEmpty(links) ? ', ' : '') + `<${link.href}> ; rel="${link.rel}"` + (isNotEmpty(link.type) ? ` ; type="${link.type}" ` : ' ');
          });

          this.responseService.setHeader('Link', links);
        });
      });
    }
  }
}
