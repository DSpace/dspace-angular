import {
  Component,
  Input,
} from '@angular/core';

import { Item } from '../../../../core/shared/item.model';
import { ThemedComponent } from '../../../../shared/theme-support/themed.component';
import { FullFileSectionComponent } from './full-file-section.component';

/**
 * Themed wrapper for {@link FullFileSectionComponent}
 */
@Component({
  selector: 'ds-item-page-full-file-section',
  styleUrls: [],
  templateUrl: './../../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [FullFileSectionComponent],
})
export class ThemedFullFileSectionComponent extends ThemedComponent<FullFileSectionComponent> {

  @Input() item: Item;

  protected inAndOutputNames: (keyof FullFileSectionComponent & keyof this)[] = ['item'];

  protected getComponentName(): string {
    return 'FullFileSectionComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/item-page/full/field-components/file-section/full-file-section.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./full-file-section.component');
  }

}
