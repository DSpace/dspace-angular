import { Component, Input, OnInit } from '@angular/core';

import { NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';
import { MediaViewerItem } from '../../../core/shared/media-viewer-item.model';

@Component({
  selector: 'ds-media-viewer-image',
  templateUrl: './media-viewer-image.component.html',
  styleUrls: ['./media-viewer-image.component.scss'],
})
export class MediaViewerImageComponent implements OnInit {
  @Input() images: MediaViewerItem[];
  constructor() {}

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  ngOnInit(): void {
    this.galleryImages = new Array<NgxGalleryImage>();
    this.galleryOptions = [
      {
        image: true,
        imageSize: 'contain',
        thumbnails: false,
        imageArrows: false,
        width: '340px',
        height: '279px',
      },
    ];
    for (const image of this.images) {
      this.galleryImages = [
        ...this.galleryImages,
        {
          small: image.thumbnail
            ? image.thumbnail
            : './assets/images/replacements_image.svg',
          medium: image.bitstream._links.content.href,
          big: image.bitstream._links.content.href,
        },
      ];
    }
  }
}
