import {
  Component,
  Input,
} from '@angular/core';

import { MediaViewerItem } from '../../../core/shared/media-viewer-item.model';
import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { MediaViewerPdfComponent } from './media-viewer-pdf.component';

/**
 * Themed wrapper for {@link MediaViewerPdfComponent}.
 */
@Component({
  selector: 'ds-media-viewer-pdf',
  styleUrls: [],
  templateUrl: '../../../shared/theme-support/themed.component.html',
})
export class ThemedMediaViewerPdfComponent extends ThemedComponent<MediaViewerPdfComponent> {

  @Input() pdfs: MediaViewerItem[];

  protected inAndOutputNames: (keyof MediaViewerPdfComponent & keyof this)[] = [
    'pdfs',
  ];

  protected getComponentName(): string {
    return 'MediaViewerPdfComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/item-page/media-viewer/media-viewer-pdf/media-viewer-pdf.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./media-viewer-pdf.component');
  }

}
