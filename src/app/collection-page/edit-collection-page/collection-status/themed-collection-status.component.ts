import { Component } from '@angular/core';

import { ThemedComponent } from '../../../shared/theme-support/themed.component';
import { CollectionStatusComponent } from './collection-status.component';

@Component({
  selector: 'ds-collection-status',
  styleUrls: [],
  templateUrl: '../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    CollectionStatusComponent,
  ],
})
export class ThemedCollectionStatusComponent extends ThemedComponent<CollectionStatusComponent> {
  protected getComponentName(): string {
    return 'CollectionStatusComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/item-page/edit-item-page/item-status/item-status.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./collection-status.component');
  }

}
