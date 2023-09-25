import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { MediaViewerImageComponent } from './media-viewer-image.component';
import { MediaViewerItem } from '../../../core/shared/media-viewer-item.model';

/**
 * Themed wrapper for {@link MediaViewerImageComponent}.
 */
@Component({
    selector: 'ds-themed-media-viewer-image',
    styleUrls: [],
    templateUrl: '../../../shared/theme-support/themed.component.html',
    standalone: true
})
export class ThemedMediaViewerImageComponent extends ThemedComponent<MediaViewerImageComponent> {

  @Input() images: MediaViewerItem[];
  @Input() preview?: boolean;
  @Input() image?: string;

  protected inAndOutputNames: (keyof MediaViewerImageComponent & keyof this)[] = [
    'images',
    'preview',
    'image',
  ];

  protected getComponentName(): string {
    return 'MediaViewerImageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/item-page/media-viewer/media-viewer-image/media-viewer-image.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./media-viewer-image.component');
  }

}
