import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryModule,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';
import { Observable } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';
import { MediaViewerItem } from '../../../core/shared/media-viewer-item.model';

/**
 * This componenet render an image gallery for the image viewer
 */
@Component({
  selector: 'ds-base-media-viewer-image',
  templateUrl: './media-viewer-image.component.html',
  styleUrls: ['./media-viewer-image.component.scss'],
  imports: [
    NgxGalleryModule,
    AsyncPipe,
  ],
  standalone: true,
})
export class MediaViewerImageComponent implements OnChanges, OnInit {
  @Input() images: MediaViewerItem[];
  @Input() preview?: boolean;
  @Input() image?: string;

  thumbnailPlaceholder = './assets/images/replacement_image.svg';

  galleryOptions: NgxGalleryOptions[] = [];

  galleryImages: NgxGalleryImage[] = [];

  /**
   * Whether or not the current user is authenticated
   */
  isAuthenticated$: Observable<boolean>;

  constructor(
    protected authService: AuthService,
  ) {
  }

  ngOnChanges(): void {
    this.galleryOptions = [
      {
        preview: this.preview !== undefined ? this.preview : true,
        image: true,
        imageSize: 'contain',
        thumbnails: false,
        imageArrows: false,
        startIndex: 0,
        imageAnimation: NgxGalleryAnimation.Slide,
        previewCloseOnEsc: true,
        previewZoom: true,
        previewRotate: true,
        previewFullscreen: true,
      },
    ];
    if (this.image) {
      this.galleryImages = [
        {
          small: this.image,
          medium: this.image,
          big: this.image,
        },
      ];
    } else {
      this.galleryImages = this.convertToGalleryImage(this.images);
    }
  }

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.ngOnChanges();
  }

  /**
   * This method convert an array of MediaViewerItem into NgxGalleryImage array
   * @param medias input NgxGalleryImage array
   */
  convertToGalleryImage(medias: MediaViewerItem[]): NgxGalleryImage[] {
    const mappedImages = [];
    for (const image of medias) {
      if (image.format === 'image') {
        mappedImages.push({
          small: image.thumbnail
            ? image.thumbnail
            : this.thumbnailPlaceholder,
          medium: image.thumbnail
            ? image.thumbnail
            : this.thumbnailPlaceholder,
          big: image.bitstream._links.content.href,
        });
      }
    }
    return mappedImages;
  }
}
