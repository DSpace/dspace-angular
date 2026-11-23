import {
  NO_ERRORS_SCHEMA,
  PLATFORM_ID,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthService } from '@dspace/core/auth/auth.service';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { MediaViewerItem } from '@dspace/core/shared/media-viewer-item.model';
import { DSONameServiceMock } from '@dspace/core/testing/dso-name.service.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

import { MediaViewerPdfComponent } from './media-viewer-pdf.component';

describe('MediaViewerPdfComponent', () => {
  let comp: MediaViewerPdfComponent;
  let fixture: ComponentFixture<MediaViewerPdfComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  const createPdf = (id: string, name: string, accessToken: string = null): MediaViewerItem => Object.assign(new MediaViewerItem(), {
    bitstream: Object.assign(new Bitstream(), {
      id,
      name,
      _links: {
        self: { href: `https://rest.example.org/server/api/core/bitstreams/${id}` },
        content: { href: `https://rest.example.org/server/api/core/bitstreams/${id}/content` },
      },
    }),
    format: 'application',
    mimetype: 'application/pdf',
    thumbnail: null,
    accessToken,
  });

  const pdf1 = createPdf('pdf-1', 'article.pdf');
  const pdf2 = createPdf('pdf-2', 'supplement.pdf');

  function configure(platformId: string): Promise<unknown> {
    authService = jasmine.createSpyObj('AuthService', { buildAuthHeader: '' });
    return TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        MediaViewerPdfComponent,
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: PLATFORM_ID, useValue: platformId },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(MediaViewerPdfComponent, {
      remove: { imports: [PdfJsViewerModule] },
    }).compileComponents();
  }

  function createComponent(): void {
    fixture = TestBed.createComponent(MediaViewerPdfComponent);
    comp = fixture.componentInstance;
  }

  function show(pdfs: MediaViewerItem[]): void {
    fixture.componentRef.setInput('pdfs', pdfs);
    fixture.detectChanges();
  }

  describe('in the browser', () => {
    beforeEach(waitForAsync(() => configure('browser')));
    beforeEach(createComponent);

    it('should show the first PDF from its content URL', () => {
      show([pdf1]);
      expect(comp.currentIndex).toBe(0);
      expect(comp.src).toBe(pdf1.bitstream._links.content.href);
      expect(fixture.debugElement.query(By.css('ng2-pdfjs-viewer'))).toBeTruthy();
    });

    it('should not send an Authorization header for anonymous users', () => {
      show([pdf1]);
      expect(comp.httpHeaders).toEqual({});
    });

    it('should send the Authorization header for logged-in users', () => {
      authService.buildAuthHeader.and.returnValue('Bearer token');
      show([pdf1]);
      expect(comp.httpHeaders).toEqual({ Authorization: 'Bearer token' });
    });

    it('should append the Request-a-Copy access token to the URL', () => {
      show([createPdf('pdf-3', 'requested.pdf', 'copy-token')]);
      expect(comp.src).toBe('https://rest.example.org/server/api/core/bitstreams/pdf-3/content?accessToken=copy-token');
    });

    it('should not show a select for a single PDF', () => {
      show([pdf1]);
      expect(fixture.debugElement.query(By.css('select'))).toBeNull();
    });

    it('should switch PDFs with the labelled select when there is more than one', () => {
      show([pdf1, pdf2]);
      const select: HTMLSelectElement = fixture.debugElement.query(By.css('select')).nativeElement;
      expect(fixture.debugElement.query(By.css(`label[for="${select.id}"]`))).toBeTruthy();
      expect(select.options.length).toBe(2);

      select.value = '1';
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(comp.currentIndex).toBe(1);
      expect(comp.src).toBe(pdf2.bitstream._links.content.href);
    });
  });

  describe('on the server', () => {
    beforeEach(waitForAsync(() => configure('server')));
    beforeEach(createComponent);

    it('should not render the viewer', () => {
      show([pdf1]);
      expect(fixture.debugElement.query(By.css('ng2-pdfjs-viewer'))).toBeNull();
    });
  });
});
