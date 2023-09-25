import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../../theme-support/themed.component';
import { SearchFiltersComponent } from './search-filters.component';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { SearchFilterConfig } from '../models/search-filter-config.model';

/**
 * Themed wrapper for SearchFiltersComponent
 */
@Component({
    selector: 'ds-themed-search-filters',
    styleUrls: [],
    templateUrl: '../../theme-support/themed.component.html',
    standalone: true
})
export class ThemedSearchFiltersComponent extends ThemedComponent<SearchFiltersComponent> {

  @Input() currentConfiguration;
  @Input() currentScope: string;
  @Input() inPlaceSearch;
  @Input() refreshFilters: Observable<any>;
  @Input() filters: Observable<RemoteData<SearchFilterConfig[]>>;

  protected inAndOutputNames: (keyof SearchFiltersComponent & keyof this)[] = [
    'filters', 'currentConfiguration', 'currentScope', 'inPlaceSearch', 'refreshFilters'];

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
