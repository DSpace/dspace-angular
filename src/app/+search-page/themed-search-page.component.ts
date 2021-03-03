import { Component } from '@angular/core';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { SearchPageComponent } from './search-page.component';

@Component({
  selector: 'ds-themed-search-page',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})
/**
 * This component represents the whole search page
 * It renders search results depending on the current search options
 */
export class ThemedSearchPageComponent extends ThemedComponent<SearchPageComponent> {

  protected getComponentName(): string {
    return 'SearchPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/+search-page/search-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./search-page.component`);
  }
}
