import { ThemedComponent } from '../shared/theme-support/themed.component';
import { Component, Input } from '@angular/core';
import { ThumbnailComponent } from './thumbnail.component';
import { Bitstream } from '../core/shared/bitstream.model';
import { RemoteData } from '../core/data/remote-data';

@Component({
    selector: 'ds-themed-thumbnail',
    styleUrls: [],
    templateUrl: '../shared/theme-support/themed.component.html',
    standalone: true
})
export class ThemedThumbnailComponent extends ThemedComponent<ThumbnailComponent> {

  @Input() thumbnail: Bitstream | RemoteData<Bitstream>;

  @Input() defaultImage?: string | null;

  @Input() alt?: string;

  @Input() placeholder?: string;

  @Input() limitWidth?: boolean;

  protected inAndOutputNames: (keyof ThumbnailComponent & keyof this)[] = [
    'thumbnail',
    'defaultImage',
    'alt',
    'placeholder',
    'limitWidth',
  ];

  protected getComponentName(): string {
    return 'ThumbnailComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/thumbnail/thumbnail.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./thumbnail.component');
  }

}
