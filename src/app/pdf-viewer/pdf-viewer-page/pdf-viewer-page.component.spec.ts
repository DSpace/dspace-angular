import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '@dspace/core/auth/auth.service';
import { AuthTokenInfo } from '@dspace/core/auth/models/auth-token-info.model';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { createSuccessfulRemoteDataObject } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { HostWindowService } from '../../shared/host-window.service';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { PdfViewerFullscreenService } from '../../shared/pdf-viewer-fullscreen/pdf-viewer-fullscreen.service';
import { PdfViewerBackButtonComponent } from '../pdf-viewer-back-button/pdf-viewer-back-button.component';
import { getPdfViewerPageRoute } from '../pdf-viewer-routing-paths';
import { PdfViewerPageComponent } from './pdf-viewer-page.component';

describe('PdfViewerPageComponent', () => {
  let component: PdfViewerPageComponent;
  let fixture: ComponentFixture<PdfViewerPageComponent>;

  let route: ActivatedRoute;
  let authService: AuthService;
  let location: Location;
  let pdfViewerFullscreenService: PdfViewerFullscreenService;
  let hostWindowService: HostWindowService;

  let authToken: AuthTokenInfo;
  let authHeader: string;
  let bitstream: Bitstream;
  let pageNumber: number;

  beforeEach(waitForAsync(() => {
    authToken = new AuthTokenInfo('Bearer eyJhbGciOiJIUzI1NiJ9.eyJlaWQiOiIzMzU2NDdiNi04YTUyLTRlY2ItYThjMS03Z' +
      'WJhYmIxOTliZGEiLCJzZyI6W10sImV4cCI6MTYyODUwMTQzOX0.6KgIoUiftGEIbQTXPM2kqQ_lgXUS6-JHLLJP6faDqoA');
    authHeader = 'test-auth-header';
    bitstream = Object.assign(new Bitstream(), {
      id: 'test-bitstream',
    });
    pageNumber = 5;

    route = Object.assign({
      data: of({
        bitstream: createSuccessfulRemoteDataObject(bitstream),
      }),
      params: of({
        ['page-number']: pageNumber,
      }),
    });
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: of(true),
      buildAuthHeader: authHeader,
      getToken: authToken,
    });
    location = jasmine.createSpyObj('location', ['replaceState', 'getState', 'back']);

    pdfViewerFullscreenService = jasmine.createSpyObj('pdfViewerFullscreenService', ['enableFullscreen', 'disableFullscreen']);

    hostWindowService = jasmine.createSpyObj('hostWindowService', {
      isXsOrSm: of(true),
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: AuthService, useValue: authService },
        { provide: Location, useValue: location },
        { provide: PdfViewerFullscreenService, useValue: pdfViewerFullscreenService },
        { provide: HostWindowService, useValue: hostWindowService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(PdfViewerPageComponent, {
        remove: {
          imports: [
            PdfViewerBackButtonComponent,
            ThemedLoadingComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('bitstreamRD$', () => {
    it('should resolve the route\'s data to a bitstream', (done) => {
      component.bitstreamRD$.subscribe((result) => {
        expect(result.payload).toEqual(bitstream);
        done();
      });
    });
  });

  describe('page$', () => {
    it('should resolve the route\'s params to a page', (done) => {
      component.page$.subscribe((result) => {
        expect(result).toEqual(pageNumber);
        done();
      });
    });
  });

  describe('pageChange', () => {
    it('should go to the bitstream\'s requested pdf viewer page', () => {
      component.pageChange(bitstream.id, 8);
      expect(location.replaceState).toHaveBeenCalledWith(getPdfViewerPageRoute(bitstream.id, 8), undefined, undefined);
    });
  });
});
