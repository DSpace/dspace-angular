import {
  Component,
  Input,
} from '@angular/core';
import { Observable } from 'rxjs';

import { RemoteData } from '../../../core/data/remote-data';
import { ThemedComponent } from '../../theme-support/themed.component';
import { SearchFilterConfig } from '../models/search-filter-config.model';
import { SearchFiltersComponent } from './search-filters.component';

/**
 * Themed wrapper for SearchFiltersComponent
 */
@Component({
  selector: 'ds-search-filters',
  templateUrl: '../../theme-support/themed.component.html',
  standalone: true,
  imports: [SearchFiltersComponent],
})
export class ThemedSearchFiltersComponent extends ThemedComponent<SearchFiltersComponent> {

  @Input() currentConfiguration: string;
  @Input() currentScope: string;
  @Input() inPlaceSearch: boolean;
  @Input() refreshFilters: Observable<boolean>;
  @Input() filters: Observable<RemoteData<SearchFilterConfig[]>>;

  protected inAndOutputNames: (keyof SearchFiltersComponent & keyof this)[] = [
    'filters', 'currentConfiguration', 'currentScope', 'inPlaceSearch', 'refreshFilters',
  ];

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
