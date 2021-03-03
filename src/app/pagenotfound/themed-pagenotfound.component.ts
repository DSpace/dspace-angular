import { Component } from '@angular/core';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { PageNotFoundComponent } from './pagenotfound.component';

@Component({
  selector: 'ds-themed-search-page',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})
/**
 * This component represents the whole search page
 * It renders search results depending on the current search options
 */
export class ThemedPageNotFoundComponent extends ThemedComponent<PageNotFoundComponent> {

  protected getComponentName(): string {
    return 'PageNotFoundComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/pagenotfound/pagenotfound.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./pagenotfound.component`);
  }
}
