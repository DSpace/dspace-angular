import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DomSanitizer,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { MediaViewerItem } from '../../../core/shared/media-viewer-item.model';

@Component({
  selector: 'ds-base-media-viewer-pdf',
  templateUrl: './media-viewer-pdf.component.html',
  styleUrls: ['./media-viewer-pdf.component.scss'],
  imports: [
    FormsModule,
    TranslateModule,
  ],
})
export class MediaViewerPdfComponent implements OnInit {
  @Input() pdfs: MediaViewerItem[];
  @ViewChild('pdfViewer') pdfViewer;

  blobUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  currentIndex = 0;

  isLoading = false;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, public dsoNameService: DSONameService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadPdf(this.currentIndex);
  }

  selectedMedia(index: number) {
    this.currentIndex = index;
    this.loadPdf(index);
  }

  private loadPdf(index: number) {
    this.isLoading = true;

    const url = this.pdfs[index].bitstream._links.content.href;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const blobUrl = URL.createObjectURL(blob);
        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        console.error('Error loading PDF:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
