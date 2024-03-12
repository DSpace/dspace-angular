import { Component } from '@angular/core';

import { MediaViewerImageComponent as BaseComponent } from '../../../../../../app/item-page/media-viewer/media-viewer-image/media-viewer-image.component';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ds-media-viewer-image',
  // templateUrl: './media-viewer-image.component.html',
  templateUrl: '../../../../../../app/item-page/media-viewer/media-viewer-image/media-viewer-image.component.html',
  // styleUrls: ['./media-viewer-image.component.scss'],
  styleUrls: ['../../../../../../app/item-page/media-viewer/media-viewer-image/media-viewer-image.component.scss'],
  standalone: true,
  imports: [
    NgxGalleryModule,
    AsyncPipe
  ],
})
export class MediaViewerImageComponent extends BaseComponent {
}
