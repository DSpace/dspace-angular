import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgxGalleryImage, NgxGalleryModule } from '@kolkov/ngx-gallery';

import { MediaViewerItem } from '../../../../../../app/core/shared/media-viewer-item.model';
import { hasValue } from '../../../../../../app/shared/empty.util';
import { MediaViewerImageComponent as BaseComponent } from '../../../../../../app/item-page/media-viewer/media-viewer-image/media-viewer-image.component';

@Component({
  selector: 'ds-themed-media-viewer-image',
  // templateUrl: './media-viewer-image.component.html',
  templateUrl: '../../../../../../app/item-page/media-viewer/media-viewer-image/media-viewer-image.component.html',
  styleUrls: ['./media-viewer-image.component.scss'],
  // styleUrls: ['../../../../../../app/item-page/media-viewer/media-viewer-image/media-viewer-image.component.scss'],
  imports: [
    AsyncPipe,
    NgxGalleryModule,
  ],
})
export class MediaViewerImageComponent extends BaseComponent {
  override thumbnailPlaceholder = '/assets/images/replacement_image.svg';

  override convertToGalleryImage(medias: MediaViewerItem[]): NgxGalleryImage[] {
    const mappedImages = [];
    for (const image of medias) {
      if (image.format === 'image') {
        const contentHref = image.bitstream._links.content.href + (hasValue(image.accessToken) ? ('?accessToken=' + image.accessToken) : '');
        mappedImages.push({
          small: contentHref,
          medium: contentHref,
          big: contentHref,
        });
      }
    }
    return mappedImages;
  }
}
