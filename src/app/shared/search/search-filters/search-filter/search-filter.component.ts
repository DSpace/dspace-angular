import {
  AsyncPipe,
  LowerCasePipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  of,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';

import { RemoteData } from '../../../../core/data/remote-data';
import { SearchService } from '../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../../core/shared/search/search-filter.service';
import { SequenceService } from '../../../../core/shared/sequence.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-configuration.service';
import { slide } from '../../../animations/slide';
import {
  hasValue,
  isNotEmpty,
} from '../../../empty.util';
import { BrowserOnlyPipe } from '../../../utils/browser-only.pipe';
import { AppliedFilter } from '../../models/applied-filter.model';
import { FacetValues } from '../../models/facet-values.model';
import { SearchFilterConfig } from '../../models/search-filter-config.model';
import { SearchOptions } from '../../models/search-options.model';
import { FACET_OPERATORS } from './search-facet-filter/search-facet-filter.component';
import { SearchFacetFilterWrapperComponent } from './search-facet-filter-wrapper/search-facet-filter-wrapper.component';

@Component({
  selector: 'ds-search-filter',
  styleUrls: ['./search-filter.component.scss'],
  templateUrl: './search-filter.component.html',
  animations: [slide],
  standalone: true,
  imports: [
    AsyncPipe,
    BrowserOnlyPipe,
    LowerCasePipe,
    NgClass,
    SearchFacetFilterWrapperComponent,
    TranslateModule,
  ],
})

/**
 * Represents a part of the filter section for a single type of filter
 */
export class SearchFilterComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * The filter config for this component
   */
  @Input() filter: SearchFilterConfig;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch: boolean;

  /**
   * Emits when the search filters values may be stale, and so they must be refreshed.
   */
  @Input() refreshFilters: BehaviorSubject<boolean>;

  /**
   * The current scope
   */
  @Input() scope: string;

  @Output() isVisibilityComputed = new EventEmitter<boolean>();

  /**
   * True when the filter is 100% collapsed in the UI
   */
  closed: boolean;

  /**
   * True when the filter controls should be hidden & removed from the tablist
   */
  notab: boolean;

  /**
   * True when the filter toggle button is focused
   */
  focusBox = false;

  /**
   * Emits true when the filter is currently collapsed in the store
   */
  collapsed$: Observable<boolean>;

  /**
   * Emits all currently selected values for this filter
   */
  appliedFilters$: Observable<AppliedFilter[]>;

  /**
   * Emits true when the current filter is supposed to be shown
   */
  active$: Observable<boolean>;

  /**
   * The current scope as an observable in order to be able to re-trigger the {@link appliedFilters$}
   */
  scope$: BehaviorSubject<string> = new BehaviorSubject(undefined);

  subs: Subscription[] = [];

  private readonly sequenceId: number;

  constructor(
    private filterService: SearchFilterService,
    private searchService: SearchService,
    @Inject(SEARCH_CONFIG_SERVICE) private searchConfigService: SearchConfigurationService,
    private sequenceService: SequenceService,
  ) {
    this.sequenceId = this.sequenceService.next();
  }

  /**
   * Requests the current set values for this filter
   * If the filter config is open by default OR the filter has at least one value, the filter should be initially expanded
   * Else, the filter should initially be collapsed
   */
  ngOnInit() {
    this.appliedFilters$ = this.searchService.getSelectedValuesForFilter(this.filter.name);
    this.active$ = this.isActive();
    this.collapsed$ = this.isCollapsed();
    this.initializeFilter();
    this.subs.push(
      this.appliedFilters$.subscribe((selectedValues: AppliedFilter[]) => {
        if (isNotEmpty(selectedValues)) {
          this.filterService.expand(this.filter.name);
        }
      }),
      this.getIsActive().subscribe(() => {
        this.isVisibilityComputed.emit(true);
      }),
    );
  }

  ngOnChanges(): void {
    if (this.scope$.value !== this.scope) {
      this.scope$.next(this.scope);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  /**
   *  Changes the state for this filter to collapsed when it's expanded and to expanded it when it's collapsed
   */
  toggle() {
    this.filterService.toggle(this.filter.name);
  }

  /**
   * Checks if the filter is currently collapsed
   * @returns {Observable<boolean>} Emits true when the current state of the filter is collapsed, false when it's expanded
   */
  private isCollapsed(): Observable<boolean> {
    return this.filterService.isCollapsed(this.filter.name);
  }

  /**
   *  Sets the initial state of the filter
   */
  initializeFilter() {
    this.filterService.initializeFilter(this.filter);
  }

  /**
   * Method to change this.collapsed to false when the slide animation ends and is sliding open
   * @param event The animation event
   */
  finishSlide(event: any): void {
    if (event.fromState === 'collapsed') {
      this.closed = false;
    }
    if (event.toState === 'collapsed') {
      this.notab = true;
    }
  }

  /**
   * Method to change this.collapsed to true when the slide animation starts and is sliding closed
   * @param event The animation event
   */
  startSlide(event: any): void {
    if (event.toState === 'collapsed') {
      this.closed = true;
    }
    if (event.fromState === 'collapsed') {
      this.notab = false;
    }
  }

  get regionId(): string {
    if (this.inPlaceSearch) {
      return `search-filter-region-${this.sequenceId}`;
    } else {
      return `search-filter-region-home-${this.sequenceId}`;
    }

  }

  get toggleId(): string {
    if (this.inPlaceSearch) {
      return `search-filter-toggle-${this.sequenceId}`;
    } else {
      return `search-filter-toggle-home-${this.sequenceId}`;
    }
  }

  /**
   * Check if a given filter is supposed to be shown or not
   * @returns {Observable<boolean>} Emits true whenever a given filter config should be shown
   */
  isActive(): Observable<boolean> {
    return this.getIsActive().pipe(
      startWith(true),
    );
  }

  /**
   * Return current filter visibility
   * @returns {Observable<boolean>} Emits true whenever a given filter config should be shown
   */
  private getIsActive():  Observable<boolean> {
    return combineLatest([
      this.appliedFilters$,
      this.searchConfigService.searchOptions,
      this.scope$,
    ]).pipe(
      switchMap(([selectedValues, options, scope]: [AppliedFilter[], SearchOptions, string]) => {
        if (isNotEmpty(selectedValues.filter((appliedFilter: AppliedFilter) => FACET_OPERATORS.includes(appliedFilter.operator)))) {
          return of(true);
        } else {
          if (hasValue(scope)) {
            options.scope = scope;
          }
          return this.searchService.getFacetValuesFor(this.filter, 1, options).pipe(
            filter((RD: RemoteData<FacetValues>) => !RD.isLoading),
            map((valuesRD: RemoteData<FacetValues>) => {
              return valuesRD.payload?.totalElements > 0;
            }),
          );
        }
      }),
    );
  }
}
