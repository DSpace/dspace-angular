import {
  Component,
  Input,
} from '@angular/core';

import { ThemedComponent } from '../../theme-support/themed.component';
import { ComcolPageContentComponent } from './comcol-page-content.component';

/**
 * Themed wrapper for {@link ComcolPageContentComponent}
 */
@Component({
  selector: 'ds-comcol-page-content',
  templateUrl: '../../theme-support/themed.component.html',
  standalone: true,
  imports: [
    ComcolPageContentComponent,
  ],
})
export class ThemedComcolPageContentComponent extends ThemedComponent<ComcolPageContentComponent> {

  @Input() title: string;

  @Input() content: string;

  @Input() hasInnerHtml: boolean;

  protected inAndOutputNames: (keyof ComcolPageContentComponent & keyof this)[] = [
    'title',
    'content',
    'hasInnerHtml',
  ];

  protected getComponentName(): string {
    return 'ComcolPageContentComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/shared/comcol/comcol-page-content/comcol-page-content.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./comcol-page-content.component');
  }

}
