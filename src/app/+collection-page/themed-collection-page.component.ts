import { Component } from '@angular/core';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { CollectionPageComponent } from './collection-page.component';

@Component({
  selector: 'ds-themed-community-page',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})

/**
 * Component to render the news section on the home page
 */
export class ThemedCollectionPageComponent extends ThemedComponent<CollectionPageComponent> {
  protected getComponentName(): string {
    return 'CollectionPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/+collection-page/collection-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./collection-page.component`);
  }

}
