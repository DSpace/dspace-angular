import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { slide } from '../../animations/slide';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchService } from '../../../core/shared/search/search.service';
import { RemoteData } from '../../../core/data/remote-data';
import { SearchFilterConfig } from '../models/search-filter-config.model';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../core/shared/search/search-filter.service';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { PaginatedSearchOptions } from '../models/paginated-search-options.model';
import { AppConfig, APP_CONFIG } from 'src/config/app-config.interface';
import { SequenceService } from '../../../core/shared/sequence.service';
@Component({
  selector: 'ds-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  animations: [slide],
})


export class AdvancedSearchComponent implements OnInit {
  /**
    * An observable containing configuration about which filters are shown and how they are shown
    */
  @Input() filters: Observable<RemoteData<SearchFilterConfig[]>>;
  @Input() searchOptions: PaginatedSearchOptions;
  /**
   * List of all filters that are currently active with their value set to null.
   * Used to reset all filters at once
   */
  clearParams;

  /**
   * The configuration to use for the search options
   */
  @Input() currentConfiguration;

  /**
   * The current search scope
   */
  @Input() currentScope: string;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * Emits when the search filters values may be stale, and so they must be refreshed.
   */
  @Input() refreshFilters: BehaviorSubject<boolean>;

  /**
   * Link to the search page
   */
  currentURL: string;
  notab: boolean;
  @Input() searchConfig;
  closed: boolean;
  collapsedSearch = false;
  focusBox = false;
  private readonly sequenceId: number;
  advSearchForm: FormGroup;
  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private formBuilder: FormBuilder,
    protected searchService: SearchService,
    protected filterService: SearchFilterService,
    protected router: Router,
    protected rdbs: RemoteDataBuildService,
    private sequenceService: SequenceService,
    @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService) {
    this.sequenceId = this.sequenceService.next();
  }

  ngOnInit(): void {

    this.advSearchForm = this.formBuilder.group({
      textsearch: new FormControl('', {
        validators: [Validators.required],
      }),
      filter: new FormControl('title', {
        validators: [Validators.required],
      }),
      operator: new FormControl('equals',
        { validators: [Validators.required], }),

    });

    this.currentURL = this.router.url;
    this.collapsedSearch = this.isCollapsed();

  }

  get textsearch() {
    return this.advSearchForm.get('textsearch');
  }

  get filter() {
    return this.advSearchForm.get('filter');
  }

  get operator() {
    return this.advSearchForm.get('operator');
  }
  paramName(filter) {
    return 'f.' + filter;
  }
  onSubmit(data) {
    if (this.advSearchForm.valid) {
      let queryParams = { [this.paramName(data.filter)]: data.textsearch + ',' + data.operator };
      if (!this.inPlaceSearch) {
        this.router.navigate([this.searchService.getSearchLink()], { queryParams: queryParams, queryParamsHandling: 'merge' });
      } else {
        this.router.navigate([], { queryParams: queryParams, queryParamsHandling: 'merge' });
      }

      this.advSearchForm.reset({ operator: data.operator, filter: data.filter, textsearch: '' });
    }
  }
  startSlide(event: any): void {
    //debugger;
    if (event.toState === 'collapsed') {
      this.closed = true;
    }
    if (event.fromState === 'collapsed') {
      this.notab = false;
    }
  }
  finishSlide(event: any): void {
    // debugger;
    if (event.fromState === 'collapsed') {
      this.closed = false;
    }
    if (event.toState === 'collapsed') {
      this.notab = true;
    }
  }
  toggle() {
    this.collapsedSearch = !this.collapsedSearch;
  }
  private isCollapsed(): boolean {
    return !this.collapsedSearch;
  }
  isActive(name): Boolean {
    return this.appConfig.advancefilter.some(item => item.filter === name);
  }

  get regionId(): string {
    return `search-advance-filter-region-${this.sequenceId}`;
  }

  get toggleId(): string {
    return `search-advance-filter-toggle-${this.sequenceId}`;
  }
}

