import { Component, Input, OnInit } from '@angular/core';
import { MediaViewerItem } from '../../../core/shared/media-viewer-item.model';

/**
 * This componenet renders a video viewer and playlist for the media viewer
 */
@Component({
  selector: 'ds-media-viewer-video',
  templateUrl: './media-viewer-video.component.html',
  styleUrls: ['./media-viewer-video.component.scss'],
})
export class MediaViewerVideoComponent implements OnInit {
  @Input() medias: MediaViewerItem[];

  filteredMedias: MediaViewerItem[];

  isCollapsed: boolean;
  currentIndex = 0;

  replacements = {
    video: './assets/images/replacement_video.svg',
    audio: './assets/images/replacement_audio.svg',
  };

  replacementThumbnail: string;

  ngOnInit() {
    this.isCollapsed = false;
    this.filteredMedias = this.medias.filter(
      (media) => media.format === 'audio' || media.format === 'video'
    );
  }

  /**
   * This method sets the reviced index into currentIndex
   * @param index Selected index
   */
  selectedMedia(index: number) {
    this.currentIndex = index;
  }

  /**
   * This method increade the number of the currentIndex
   */
  nextMedia() {
    this.currentIndex++;
  }

  /**
   * This method decrese the number of the currentIndex
   */
  prevMedia() {
    this.currentIndex--;
  }
}
