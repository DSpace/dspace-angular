import {
  Component,
  Input,
} from '@angular/core';

import { Bitstream } from '../../core/shared/bitstream.model';
import { Item } from '../../core/shared/item.model';
import { ThemedComponent } from '../theme-support/themed.component';
import { FileDownloadLinkComponent } from './file-download-link.component';

@Component({
  selector: 'ds-file-download-link',
  styleUrls: [],
  templateUrl: '../theme-support/themed.component.html',
  standalone: true,
  imports: [
    FileDownloadLinkComponent,
  ],
})
export class ThemedFileDownloadLinkComponent extends ThemedComponent<FileDownloadLinkComponent> {

  @Input() bitstream: Bitstream;

  @Input() item: Item;

  @Input() cssClasses: string;

  @Input() isBlank: boolean;

  @Input() enableRequestACopy: boolean;

  @Input() showAccessStatusBadge: boolean;

  @Input() showIcon: boolean;

  protected inAndOutputNames: (keyof FileDownloadLinkComponent & keyof this)[] = [
    'bitstream',
    'item',
    'cssClasses',
    'isBlank',
    'enableRequestACopy',
    'showAccessStatusBadge',
    'showIcon',
  ];

  protected getComponentName(): string {
    return 'FileDownloadLinkComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/shared/file-download-link/file-download-link.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./file-download-link.component');
  }

}
