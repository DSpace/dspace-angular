import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

import { MediaViewerPdfComponent as BaseComponent } from '../../../../../../app/item-page/media-viewer/media-viewer-pdf/media-viewer-pdf.component';

@Component({
  selector: 'ds-themed-media-viewer-pdf',
  // templateUrl: './media-viewer-pdf.component.html',
  templateUrl: '../../../../../../app/item-page/media-viewer/media-viewer-pdf/media-viewer-pdf.component.html',
  // styleUrls: ['./media-viewer-pdf.component.scss'],
  styleUrls: ['../../../../../../app/item-page/media-viewer/media-viewer-pdf/media-viewer-pdf.component.scss'],
  imports: [
    PdfJsViewerModule,
    TranslateModule,
  ],
})
export class MediaViewerPdfComponent extends BaseComponent {
}
