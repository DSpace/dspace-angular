import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID,
} from '@angular/core';
import { AuthService } from '@dspace/core/auth/auth.service';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { MediaViewerItem } from '@dspace/core/shared/media-viewer-item.model';
import { URLCombiner } from '@dspace/core/url-combiner/url-combiner';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

/**
 * This component renders an embedded PDF viewer (Mozilla PDF.js, through ng2-pdfjs-viewer) for the media viewer.
 * When the item has more than one PDF, a select switches between them.
 */
@Component({
  selector: 'ds-base-media-viewer-pdf',
  templateUrl: './media-viewer-pdf.component.html',
  styleUrls: ['./media-viewer-pdf.component.scss'],
  imports: [
    PdfJsViewerModule,
    TranslateModule,
  ],
})
export class MediaViewerPdfComponent implements OnChanges {
  @Input() pdfs: MediaViewerItem[];

  /**
   * Folder the PDF.js viewer is served from, copied there from node_modules/ng2-pdfjs-viewer/pdfjs at build time
   */
  readonly viewerFolder = 'assets/pdfjs';

  currentIndex = 0;

  /**
   * URL of the selected PDF
   */
  src: string;

  /**
   * Headers for the viewer's own download of the PDF: the Authorization header for logged-in users, so restricted
   * PDFs load whenever they could be downloaded, and none for anonymous users. Always set (even when empty), because
   * PDF.js only opens same-origin URLs itself and the REST API is often on another host: with headers set,
   * ng2-pdfjs-viewer downloads the file and hands PDF.js a blob URL instead.
   */
  httpHeaders: Record<string, string>;

  /**
   * The viewer is an iframe that loads the PDF in the browser, so it is not rendered on the server
   */
  readonly isBrowser: boolean;

  constructor(
    public dsoNameService: DSONameService,
    protected authService: AuthService,
    @Inject(PLATFORM_ID) platformId: any,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnChanges(): void {
    this.selectPdf(0);
  }

  /**
   * Show the PDF at the given index
   * @param index Selected index
   */
  selectPdf(index: number): void {
    this.currentIndex = index;
    const pdf: MediaViewerItem = this.pdfs?.[index];
    if (!hasValue(pdf)) {
      this.src = undefined;
      return;
    }
    const href = pdf.bitstream._links.content.href;
    this.src = hasValue(pdf.accessToken) ? new URLCombiner(href, `?accessToken=${pdf.accessToken}`).toString() : href;
    const authHeader = this.authService.buildAuthHeader();
    this.httpHeaders = isNotEmpty(authHeader) ? { Authorization: authHeader } : {};
  }
}
