import { Component, Input } from '@angular/core';
import { MediaViewerItem } from '../../../core/shared/media-viewer-item.model';

/**
 * This componenet renders a video viewer and playlist for the media viewer
 */
@Component({
  selector: 'ds-media-viewer-video',
  templateUrl: './media-viewer-video.component.html',
  styleUrls: ['./media-viewer-video.component.scss'],
})
export class MediaViewerVideoComponent {
  @Input() medias: MediaViewerItem[];

  isCollapsed = false;

  currentIndex = 0;

  replacements = {
    video: './assets/images/replacement_video.svg',
    audio: './assets/images/replacement_audio.svg',
  };

  replacementThumbnail: string;

  /**
   * This method sets the received index into currentIndex
   * @param index Selected index
   */
  selectedMedia(index: number) {
    this.currentIndex = index;
  }

  /**
   * This method increases the number of the currentIndex
   */
  nextMedia() {
    this.currentIndex++;
  }

  /**
   * This method decreases the number of the currentIndex
   */
  prevMedia() {
    this.currentIndex--;
  }
}
