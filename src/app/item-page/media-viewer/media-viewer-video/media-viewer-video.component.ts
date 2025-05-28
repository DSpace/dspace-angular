
import {
  Component,
  Input,
} from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Bitstream } from 'src/app/core/shared/bitstream.model';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { MediaViewerItem } from '../../../core/shared/media-viewer-item.model';
import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { hasValue } from '../../../shared/empty.util';
import { CaptionInfo } from './caption-info';
import { languageHelper } from './language-helper';

/**
 * This component renders a video viewer and playlist for the media viewer
 */
@Component({
  selector: 'ds-base-media-viewer-video',
  templateUrl: './media-viewer-video.component.html',
  styleUrls: ['./media-viewer-video.component.scss'],
  imports: [
    BtnDisabledDirective,
    NgbDropdownModule,
    TranslateModule,
  ],
  standalone: true,
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

    for (const media of filteredCapMedias) {
      const srclang: string = media.name.slice(-6, -4).toLowerCase();
      capInfos.push(new CaptionInfo(
        this.constructHref(media._links.content.href),
        srclang,
        languageHelper[srclang],
      ));
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

  /**
   * Construct a URL with Request-a-Copy access token appended, if present
   * @param baseHref
   */
  constructHref(baseHref) {
    if (hasValue(this.medias) && this.medias.length >= 1 && hasValue(this.medias[0].accessToken)) {
      return baseHref + '?accessToken=' + this.medias[0].accessToken;
    }
    return baseHref;
  }
}
