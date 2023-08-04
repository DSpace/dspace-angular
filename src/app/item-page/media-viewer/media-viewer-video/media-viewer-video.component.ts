import { Component, Input } from '@angular/core';
import { MediaViewerItem } from '../../../core/shared/media-viewer-item.model';
import { languageHelper } from './language-helper';
import { CaptionInfo} from './caption-info';

/**
 * This component renders a video viewer and playlist for the media viewer
 */
@Component({
  selector: 'ds-media-viewer-video',
  templateUrl: './media-viewer-video.component.html',
  styleUrls: ['./media-viewer-video.component.scss'],
})
export class MediaViewerVideoComponent {
  @Input() medias: MediaViewerItem[];

  @Input() captions: Bitstream[] = [];

  isCollapsed = false;

  currentIndex = 0;

  replacements = {
    video: './assets/images/replacement_video.svg',
    audio: './assets/images/replacement_audio.svg',
  };

  constructor(
    public dsoNameService: DSONameService,
  ) {
  }

  /**
   * This method check if there is caption file for the media
   * The caption file name is the media name plus "-" following two letter
   * language code and .vtt suffix
   *
   * html5 video only support WEBVTT format
   *
   * Two letter language code reference
   * https://www.w3schools.com/tags/ref_language_codes.asp
   */
  getMediaCap(name: string, captions: Bitstream[]): CaptionInfo[] {
    const capInfos: CaptionInfo[] = [];
    const filteredCapMedias: Bitstream[] = captions
      .filter((media: Bitstream) => media.name.substring(0, (media.name.length - 7)).toLowerCase() === name.toLowerCase());

  ngOnInit() {
    this.isCollapsed = false;
    this.filteredMedias = this.medias.filter((media) => media.format === 'audio' || media.format === 'video');
  }

  /**
   * This method check if there is caption file for the media
   * The caption file name is the media name plus "-" following two letter
   * language code and .vtt suffix
   *
   * html5 video only support WEBVTT format
   *
   * Two letter language code reference
   * https://www.w3schools.com/tags/ref_language_codes.asp
   */
  getMediaCap(name: string): CaptionInfo[] {
    let filteredCapMedias: MediaViewerItem[];
    let capInfos: CaptionInfo[] = [];
    filteredCapMedias = this.medias
       .filter((media) => media.mimetype === 'text/vtt')
       .filter((media) => media.bitstream.name.substring(0, (media.bitstream.name.length - 7) ).toLowerCase() === name.toLowerCase());

    if (filteredCapMedias) {
      filteredCapMedias
        .forEach((media, index) => {
          let srclang: string = media.bitstream.name.slice(-6, -4).toLowerCase();
          capInfos.push(new CaptionInfo(
            media.bitstream._links.content.href,
            srclang,
            languageHelper[srclang]
          ));
        });
    }
    return capInfos;
  }

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
