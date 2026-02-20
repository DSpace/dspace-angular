import { Location } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';

import {
  NativeWindowRef,
  NativeWindowService,
} from '../../core/services/window.service';
import { PdfViewerFullscreenService } from '../../shared/pdf-viewer-fullscreen/pdf-viewer-fullscreen.service';

@Component({
  selector: 'ds-pdf-viewer-back-button',
  templateUrl: './pdf-viewer-back-button.component.html',
  styleUrls: ['./pdf-viewer-back-button.component.scss'],
  standalone: true,
})
export class PdfViewerBackButtonComponent implements OnInit {
  canGoBack: boolean;

  constructor(private location: Location,
              @Inject(NativeWindowService) private windowRef: NativeWindowRef,
              private pdfViewerFullscreenService: PdfViewerFullscreenService,
  ) { }


  ngOnInit(): void {
    this.canGoBack = this.windowRef.nativeWindow.history?.length > 1;
  }

  onClick(): void {
    this.pdfViewerFullscreenService.disableFullscreen();
    this.location.back();
  }
}
