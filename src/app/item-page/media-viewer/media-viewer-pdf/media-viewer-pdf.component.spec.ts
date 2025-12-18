import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  ChangeDetectorRef,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  By,
  DomSanitizer,
} from '@angular/platform-browser';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { MediaViewerItem } from '@dspace/core/shared/media-viewer-item.model';
import { MockBitstreamFormat1 } from '@dspace/core/testing/item.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { MediaViewerPdfComponent } from './media-viewer-pdf.component';

describe('MediaViewerPdfComponent', () => {
  let component: MediaViewerPdfComponent;
  let fixture: ComponentFixture<MediaViewerPdfComponent>;
  let httpMock: HttpTestingController;
  let sanitizer: DomSanitizer;

  const mockBitstream: Bitstream = Object.assign(new Bitstream(), {
    sizeBytes: 1024,
    format: of(MockBitstreamFormat1),
    _links: {
      self: {
        href: 'https://demo.dspace.org/api/core/bitstreams/123',
      },
      content: {
        href: 'https://demo.dspace.org/api/core/bitstreams/123/content',
      },
    },
    id: '123',
    uuid: '123',
    type: 'bitstream',
    metadata: {
      'dc.title': [
        { language: null, value: 'test_pdf.pdf' },
      ],
    },
  });

  const mockMediaViewerItems: MediaViewerItem[] = [
    { bitstream: mockBitstream, format: 'application', mimetype: 'application/pdf', thumbnail: null, accessToken: null },
    { bitstream: mockBitstream, format: 'application', mimetype: 'application/pdf', thumbnail: null, accessToken: null },
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
        MediaViewerPdfComponent,
      ],
      providers: [
        DSONameService,
        ChangeDetectorRef,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaViewerPdfComponent);
    component = fixture.componentInstance;
    sanitizer = TestBed.inject(DomSanitizer);
    httpMock = TestBed.inject(HttpTestingController);
    component.pdfs = mockMediaViewerItems;
    fixture.detectChanges();
    const initReq = httpMock.expectOne('https://demo.dspace.org/api/core/bitstreams/123/content');
    initReq.flush(new Blob(['initial content'], { type: 'application/pdf' }));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadPdf with index 0', () => {
      spyOn<any>(component, 'loadPdf');
      component.ngOnInit();
      // Dot notation cannot be used because 'loadPdf' is a private method.
      // Accessing the private method only for testing purposes.
      // eslint-disable-next-line @typescript-eslint/dot-notation
      expect(component['loadPdf']).toHaveBeenCalledWith(0);
    });
  });

  describe('loadPdf', () => {
    it('should load and set blobUrl on success', () => {
      const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });
      const bypassSpy = spyOn(sanitizer, 'bypassSecurityTrustResourceUrl').and.callThrough();

      component.ngOnInit();
      const req = httpMock.expectOne('https://demo.dspace.org/api/core/bitstreams/123/content');
      expect(req.request.method).toBe('GET');
      req.flush(mockBlob);

      expect(component.isLoading).toBeFalse();
      expect(bypassSpy).toHaveBeenCalled();
      expect(component.blobUrl).toBeTruthy();
    });

    it('should handle errors gracefully', () => {
      spyOn(console, 'error');
      component.ngOnInit();
      const req = httpMock.expectOne('https://demo.dspace.org/api/core/bitstreams/123/content');
      req.error(new ProgressEvent('Network error'));

      expect(component.isLoading).toBeFalse();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('selectedMedia', () => {
    it('should set currentIndex and load the selected pdf', () => {
      const spyLoad = spyOn<any>(component, 'loadPdf');
      component.selectedMedia(1);
      expect(component.currentIndex).toBe(1);
      expect(spyLoad).toHaveBeenCalledWith(1);
    });
  });

  describe('UI template', () => {
    it('should display the select element with the correct number of options', () => {
      fixture.detectChanges();
      const selectEl = fixture.debugElement.query(By.css('select'));
      expect(selectEl).toBeTruthy();

      const options = selectEl.nativeElement.querySelectorAll('option');
      expect(options.length).toBe(2);
    });

    it('should show loading overlay when isLoading is true', () => {
      component.isLoading = true;
      fixture.detectChanges();
      const loadingEl = fixture.debugElement.query(By.css('.loading-overlay'));
      expect(loadingEl).toBeTruthy();
    });

    it('should show pdf object when not loading', () => {
      component.isLoading = false;
      fixture.detectChanges();
      const objectEl = fixture.debugElement.query(By.css('object'));
      expect(objectEl).toBeTruthy();
    });
  });
});
