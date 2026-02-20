import {
  CommonModule,
  Location,
} from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  NgxExtendedPdfViewerModule,
  PdfLoadedEvent,
} from 'ngx-extended-pdf-viewer';
import {
  BehaviorSubject,
  Observable,
  Subscription,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../../core/auth/auth.service';
import { RemoteData } from '../../core/data/remote-data';
import { redirectOn4xx } from '../../core/shared/authorized.operators';
import { Bitstream } from '../../core/shared/bitstream.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { HostWindowService } from '../../shared/host-window.service';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { VarDirective } from '../../shared/utils/var.directive';
import { PdfViewerFullscreenService } from '../../shared/pdf-viewer-fullscreen/pdf-viewer-fullscreen.service';
import { PdfViewerBackButtonComponent } from '../pdf-viewer-back-button/pdf-viewer-back-button.component';
import { getPdfViewerPageRoute } from '../pdf-viewer-routing-paths';

@Component({
  selector: 'ds-pdf-viewer-page',
  templateUrl: './pdf-viewer-page.component.html',
  styleUrls: ['./pdf-viewer-page.component.scss'],
  standalone: true,
  imports: [
    PdfViewerBackButtonComponent,
    CommonModule,
    NgxExtendedPdfViewerModule,
    ThemedLoadingComponent,
    VarDirective,
  ],
})
export class PdfViewerPageComponent implements OnInit, OnDestroy {

  bitstreamRD$: Observable<RemoteData<Bitstream>>;

  page$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  authHeader: string;

  subs: Subscription[] = [];

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected auth: AuthService,
    protected location: Location,
    protected pdfViewerFullscreenService: PdfViewerFullscreenService,
    public hostWindowService: HostWindowService,
  ) {
  }

  ngOnInit(): void {
    this.bitstreamRD$ = this.route.data.pipe(
      map((data) => data.bitstream),
      redirectOn4xx(this.router, this.auth),
    );

    this.subs.push(
      this.route.params.pipe(
        map((params) => +params['page-number']),
      ).subscribe((pageNumber) => this.page$.next(pageNumber)),
    );

    this.authHeader = this.auth.buildAuthHeader(this.auth.getToken());

    this.pdfViewerFullscreenService.enableFullscreen();
  }

  pdfLoaded(event: PdfLoadedEvent) {
    console.log('PDF loaded', event);
  }

  pageChange(bitstreamId: string, page: number) {
    this.page$.next(page);
    this.location.replaceState(getPdfViewerPageRoute(bitstreamId, page), undefined, this.location.getState());
  }

  shouldShowSidebar() {
    return this.hostWindowService.isXsOrSm().pipe(map((isXsOrSm) => !isXsOrSm ));
  }

  ngOnDestroy(): void {
    this.pdfViewerFullscreenService.disableFullscreen();
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
