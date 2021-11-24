import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { SearchComponent } from './search.component';
import { Observable } from 'rxjs';
import { Context } from '../core/shared/context.model';

/**
 * Themed wrapper for SearchComponent
 */
@Component({
  selector: 'ds-themed-search',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})
export class ThemedSearchComponent extends ThemedComponent<SearchComponent> {
  protected inAndOutputNames: (keyof SearchComponent & keyof this)[] = [
    'inPlaceSearch', 'searchEnabled', 'sideBarWidth', 'configuration$', 'context', 'scopeSelectable'
  ];

  @Input() inPlaceSearch = true;

  @Input()
  searchEnabled = true;

  @Input()
  sideBarWidth = 3;

  @Input()
  configuration$: Observable<string>;

  @Input()
  context: Context;

  @Input() scopeSelectable = true;

  protected getComponentName(): string {
    return 'SearchComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/search-page/search.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./search.component');
  }
}
