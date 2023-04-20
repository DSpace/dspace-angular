import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { MediaViewerItem } from '../../../core/shared/media-viewer-item.model';
import { MediaViewerVideoComponent } from './media-viewer-video.component';
import { Bitstream } from '../../../core/shared/bitstream.model';

/**
 * Themed wrapper for {@link MediaViewerVideoComponent}.
 */
@Component({
  selector: 'ds-themed-media-viewer-video',
  styleUrls: [],
  templateUrl: '../../../shared/theme-support/themed.component.html',
})
export class ThemedMediaViewerVideoComponent extends ThemedComponent<MediaViewerVideoComponent> {

  @Input() medias: MediaViewerItem[];

  @Input() captions: Bitstream[];

  protected inAndOutputNames: (keyof MediaViewerVideoComponent & keyof this)[] = [
    'medias',
    'captions',
  ];

  protected getComponentName(): string {
    return 'MediaViewerVideoComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/item-page/media-viewer/media-viewer-video/media-viewer-video.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./media-viewer-video.component');
  }

}
