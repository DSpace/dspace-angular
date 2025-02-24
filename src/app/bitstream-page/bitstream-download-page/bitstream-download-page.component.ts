import {
  AsyncPipe,
  isPlatformServer,
  Location,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  AuthorizationDataService,
  AuthService,
  Bitstream,
  DSONameService,
  FeatureID,
  FileService,
  getRemoteDataPayload,
  HardRedirectService,
  redirectOn4xx,
  RemoteData,
  ServerResponseService,
  SignpostingDataService,
  SignpostingLink,
} from '@dspace/core';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of as observableOf,
} from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { getForbiddenRoute } from '../../app-routing-paths';

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
    @Inject(PLATFORM_ID) protected platformId: string,
  ) {
    this.initPageLinks();
  }

  back(): void {
    this.location.back();
  }

  ngOnInit(): void {

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
        return observableCombineLatest([isAuthorized$, isLoggedIn$, observableOf(bitstream)]);
      }),
      filter(([isAuthorized, isLoggedIn, bitstream]: [boolean, boolean, Bitstream]) => hasValue(isAuthorized) && hasValue(isLoggedIn)),
      take(1),
      switchMap(([isAuthorized, isLoggedIn, bitstream]: [boolean, boolean, Bitstream]) => {
        if (isAuthorized && isLoggedIn) {
          return this.fileService.retrieveFileDownloadLink(bitstream._links.content.href).pipe(
            filter((fileLink) => hasValue(fileLink)),
            take(1),
            map((fileLink) => {
              return [isAuthorized, isLoggedIn, bitstream, fileLink];
            }));
        } else {
          return [[isAuthorized, isLoggedIn, bitstream, '']];
        }
      }),
    ).subscribe(([isAuthorized, isLoggedIn, bitstream, fileLink]: [boolean, boolean, Bitstream, string]) => {
      if (isAuthorized && isLoggedIn && isNotEmpty(fileLink)) {
        this.hardRedirectService.redirect(fileLink);
      } else if (isAuthorized && !isLoggedIn) {
        this.hardRedirectService.redirect(bitstream._links.content.href);
      } else if (!isAuthorized && isLoggedIn) {
        this.router.navigateByUrl(getForbiddenRoute(), { skipLocationChange: true });
      } else if (!isAuthorized && !isLoggedIn) {
        this.auth.setRedirectUrl(this.router.url);
        this.router.navigateByUrl('login');
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
