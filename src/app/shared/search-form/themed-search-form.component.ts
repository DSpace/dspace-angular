import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ThemedComponent } from '../theme-support/themed.component';
import { SearchFormComponent } from './search-form.component';

/**
 * Themed wrapper for {@link SearchFormComponent}
 */
@Component({
  selector: 'ds-themed-search-form',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedSearchFormComponent extends ThemedComponent<SearchFormComponent> {

  @Input() query: string;

  @Input() inPlaceSearch: boolean;

  @Input() scope: string;

  @Input() currentUrl: string;

  @Input() large: boolean;

  @Input() brandColor: string;

  @Input() searchPlaceholder: string;

  @Input() showScopeSelector: boolean;

  @Output() submitSearch: EventEmitter<any> = new EventEmitter();

  protected inAndOutputNames: (keyof SearchFormComponent & keyof this)[] = [
    'query', 'inPlaceSearch', 'scope', 'currentUrl', 'large', 'brandColor', 'searchPlaceholder', 'showScopeSelector',
    'submitSearch',
  ];

  protected getComponentName(): string {
    return 'SearchFormComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/shared/search-form/search-form.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./search-form.component');
  }

}
