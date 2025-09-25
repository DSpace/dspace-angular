import {
  Component,
  Input,
} from '@angular/core';

import { MediaViewerConfig } from '../../../config/media-viewer-config.interface';
import { Item } from '../../core/shared/item.model';
import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { MediaViewerComponent } from './media-viewer.component';

/**
 * Themed wrapper for {@link MediaViewerComponent}.
 */
@Component({
  selector: 'ds-media-viewer',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    MediaViewerComponent,
  ],
})
export class ThemedMediaViewerComponent extends ThemedComponent<MediaViewerComponent> {

  @Input() item: Item;
  @Input() mediaOptions: MediaViewerConfig;

  protected inAndOutputNames: (keyof MediaViewerComponent & keyof this)[] = [
    'item',
    'mediaOptions',
  ];

  protected getComponentName(): string {
    return 'MediaViewerComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/item-page/media-viewer/media-viewer.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./media-viewer.component');
  }

}
