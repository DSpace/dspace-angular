import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../config/app-config.interface';
import { SortOptions } from '../../../core/cache/models/sort-options.model';
import { RemoteData } from '../../../core/data/remote-data';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { FilterConfig } from '../../../core/shared/search/search-filters/search-config.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { ViewModeSwitchComponent } from '../../view-mode-switch/view-mode-switch.component';
import { AdvancedSearchComponent } from '../advanced-search/advanced-search.component';
import { PaginatedSearchOptions } from '../models/paginated-search-options.model';
import { SearchFilterConfig } from '../models/search-filter-config.model';
import { ThemedSearchFiltersComponent } from '../search-filters/themed-search-filters.component';
import { ThemedSearchSettingsComponent } from '../search-settings/themed-search-settings.component';
import { SearchConfigurationOption } from '../search-switch-configuration/search-configuration-option.model';
import { SearchSwitchConfigurationComponent } from '../search-switch-configuration/search-switch-configuration.component';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-base-search-sidebar',
  styleUrls: ['./search-sidebar.component.scss'],
  templateUrl: './search-sidebar.component.html',
  standalone: true,
  imports: [NgIf, ViewModeSwitchComponent, SearchSwitchConfigurationComponent, ThemedSearchFiltersComponent, ThemedSearchSettingsComponent, TranslateModule, AdvancedSearchComponent, AsyncPipe],
})

/**
 * Component representing the sidebar on the search page
 */
export class SearchSidebarComponent implements OnInit {

  /**
   * The configuration to use for the search options
   */
  @Input() configuration: string;

  /**
   * The list of available configuration options
   */
  @Input() configurationList: SearchConfigurationOption[];

  /**
   * The current search scope
   */
  @Input() currentScope: string;

  /**
   * The current sort option used
   */
  @Input() currentSortOption: SortOptions;

  /**
   * An observable containing configuration about which filters are shown and how they are shown
   */
  @Input() filters: Observable<RemoteData<SearchFilterConfig[]>>;

  /**
   * The total amount of results
   */
  @Input() resultCount: number;

  /**
   * The list of available view mode options
   */
  @Input() viewModeList: ViewMode[];

  /**
   * Whether to show the view mode switch
   */
  @Input() showViewModes = true;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch = true;

  /**
   * The configuration for the current paginated search results
   */
  @Input() searchOptions: PaginatedSearchOptions;

  /**
   * All sort options that are shown in the settings
   */
  @Input() sortOptionsList: SortOptions[];

  /**
   * Emits when the search filters values may be stale, and so they must be refreshed.
   */
  @Input() refreshFilters: BehaviorSubject<boolean>;

  /**
   * Emits event when the user clicks a button to open or close the sidebar
   */
  @Output() toggleSidebar = new EventEmitter<boolean>();

  /**
   * Emits event when the user select a new configuration
   */
  @Output() changeConfiguration: EventEmitter<SearchConfigurationOption> = new EventEmitter<SearchConfigurationOption>();

  /**
   * Emits event when the user select a new view mode
   */
  @Output() changeViewMode: EventEmitter<ViewMode> = new EventEmitter<ViewMode>();

  showAdvancedSearch$: Observable<boolean>;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected searchConfigurationService: SearchConfigurationService,
  ) {
  }

  ngOnInit(): void {
    this.showAdvancedSearch$ = this.searchConfigurationService.getConfigurationAdvancedSearchFilters(this.configuration, this.currentScope).pipe(
      map((advancedFilters: FilterConfig[]) => this.appConfig.search.advancedFilters.enabled && advancedFilters.length > 0),
    );
  }

}
