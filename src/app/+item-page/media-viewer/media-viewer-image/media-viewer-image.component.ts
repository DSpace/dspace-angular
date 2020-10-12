import { Component, Input, OnInit } from '@angular/core';
import { NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { MediaViewerItem } from '../../../core/shared/media-viewer-item.model';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';
/**
 * This componenet render an image gallery for the image viewer
 */
@Component({
  selector: 'ds-media-viewer-image',
  templateUrl: './media-viewer-image.component.html',
  styleUrls: ['./media-viewer-image.component.scss'],
})
export class MediaViewerImageComponent implements OnInit {
  @Input() images: MediaViewerItem[];

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  /**
   * Thi method sets up the gallery settings and data
   */
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
        startIndex: 0,
        imageAnimation: NgxGalleryAnimation.Slide,
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
