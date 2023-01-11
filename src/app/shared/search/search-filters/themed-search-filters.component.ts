import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../../theme-support/themed.component';
import { SearchFiltersComponent } from './search-filters.component';
import { Observable } from 'rxjs/internal/Observable';

/**
 * Themed wrapper for SearchFiltersComponent
 */
@Component({
  selector: 'ds-themed-search-filters',
  styleUrls: [],
  templateUrl: '../../theme-support/themed.component.html',
})
export class ThemedSearchFiltersComponent extends ThemedComponent<SearchFiltersComponent> {

  @Input() currentConfiguration;
  @Input() currentScope: string;
  @Input() inPlaceSearch;
  @Input() refreshFilters: Observable<any>;

  protected inAndOutputNames: (keyof SearchFiltersComponent & keyof this)[] = [
    'currentConfiguration', 'currentScope', 'inPlaceSearch', 'refreshFilters'];

  protected getComponentName(): string {
    return 'SearchFiltersComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/shared/search/search-filters/search-filters.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./search-filters.component');
  }
}
