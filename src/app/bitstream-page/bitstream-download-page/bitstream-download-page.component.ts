import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { map, startWith, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { isNotEmpty } from '../../shared/empty.util';
import { getRemoteDataPayload } from '../../core/shared/operators';
import { Bitstream } from '../../core/shared/bitstream.model';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { AuthService } from '../../core/auth/auth.service';
import { Observable } from 'rxjs';
import { FileService } from '../../core/shared/file.service';
import { HardRedirectService } from '../../core/services/hard-redirect.service';
import { RemoteData } from '../../core/data/remote-data';
import { isPlatformServer, Location } from '@angular/common';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { SignpostingDataService } from '../../core/data/signposting-data.service';
import { ServerResponseService } from '../../core/services/server-response.service';
import { SignpostingLink } from '../../core/data/signposting-links.model';
import { NativeWindowRef, NativeWindowService } from '../../core/services/window.service';

@Component({
  selector: 'ds-bitstream-download-page',
  templateUrl: './bitstream-download-page.component.html'
})
/**
 * Page component for downloading a bitstream
 */
export class BitstreamDownloadPageComponent implements OnInit {

  bitstream$: Observable<Bitstream>;
  bitstreamRD$: Observable<RemoteData<Bitstream>>;

  fileName$: Observable<string>;

  hasHistory = this._window.nativeWindow.history?.length > 1;

  constructor(
    @Inject(NativeWindowService) private _window: NativeWindowRef,
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
    @Inject(PLATFORM_ID) protected platformId: string
  ) {
    this.initPageLinks();
  }

  back(): void {
    this.location.back();
  }

  close(): void {
    this._window.nativeWindow.self.close();
  }

  ngOnInit(): void {
    this.bitstreamRD$ = this.route.data.pipe(
      map((data) => data.bitstream)
    );

    this.bitstream$ = this.bitstreamRD$.pipe(
      getRemoteDataPayload()
    );

    this.fileName$ = this.bitstream$.pipe(
      map((bitstream: Bitstream) => this.dsoNameService.getName(bitstream)),
      startWith('file')
    );
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
