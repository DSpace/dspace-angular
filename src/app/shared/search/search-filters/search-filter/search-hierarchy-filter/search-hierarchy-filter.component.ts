import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
} from '@angular/core';
import {
  Params,
  Router,
} from '@angular/router';
import {
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import {
  BehaviorSubject,
  from,
  Observable,
} from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../../config/app-config.interface';
import { FilterVocabularyConfig } from '../../../../../../config/filter-vocabulary-config';
import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { PageInfo } from '../../../../../core/shared/page-info.model';
import { SearchService } from '../../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import {
  CHANGE_APPLIED_FILTERS,
  FILTER_CONFIG,
  IN_PLACE_SEARCH,
  REFRESH_FILTER,
  SCOPE,
  SearchFilterService,
} from '../../../../../core/shared/search/search-filter.service';
import { VocabularyEntryDetail } from '../../../../../core/submission/vocabularies/models/vocabulary-entry-detail.model';
import { VocabularyService } from '../../../../../core/submission/vocabularies/vocabulary.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-page.component';
import { hasValue } from '../../../../empty.util';
import { VocabularyTreeviewModalComponent } from '../../../../form/vocabulary-treeview-modal/vocabulary-treeview-modal.component';
import { AppliedFilter } from '../../../models/applied-filter.model';
import { FilterType } from '../../../models/filter-type.model';
import { SearchFilterConfig } from '../../../models/search-filter-config.model';
import { addOperatorToFilterValue } from '../../../search.utils';
import {
  facetLoad,
  SearchFacetFilterComponent,
} from '../search-facet-filter/search-facet-filter.component';
import { renderFacetFor } from '../search-filter-type-decorator';

@Component({
  selector: 'ds-search-hierarchy-filter',
  styleUrls: ['./search-hierarchy-filter.component.scss'],
  templateUrl: './search-hierarchy-filter.component.html',
  animations: [facetLoad],
})

/**
 * Component that represents a hierarchy facet for a specific filter configuration
 */
@renderFacetFor(FilterType.hierarchy)
export class SearchHierarchyFilterComponent extends SearchFacetFilterComponent implements OnInit {

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected rdbs: RemoteDataBuildService,
              protected router: Router,
              protected modalService: NgbModal,
              protected vocabularyService: VocabularyService,
              @Inject(APP_CONFIG) protected appConfig: AppConfig,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              @Inject(IN_PLACE_SEARCH) public inPlaceSearch: boolean,
              @Inject(FILTER_CONFIG) public filterConfig: SearchFilterConfig,
              @Inject(REFRESH_FILTER) public refreshFilters: BehaviorSubject<boolean>,
              @Inject(SCOPE) public scope: string,
              @Inject(CHANGE_APPLIED_FILTERS) public changeAppliedFilters: EventEmitter<AppliedFilter[]>,
  ) {
    super(searchService, filterService, rdbs, router, searchConfigService, inPlaceSearch, filterConfig, refreshFilters, scope, changeAppliedFilters);
  }

  vocabularyExists$: Observable<boolean>;

  /**
   * Submits a new active custom value to the filter from the input field
   * Overwritten method from parent component, adds the "query" operator to the received data before passing it on
   * @param data The string from the input field
   */ onSubmit(data: any) {
    super.onSubmit(addOperatorToFilterValue(data, 'query'));
  }

  ngOnInit(): void {
    super.ngOnInit();
    const vocabularyName: string = this.getVocabularyEntry();
    if (hasValue(vocabularyName)) {
      this.vocabularyExists$ = this.vocabularyService.searchTopEntries(
        vocabularyName, new PageInfo(), true, false,
      ).pipe(
        filter(rd => rd.hasCompleted),
        take(1),
        map(rd => {
          return rd.hasSucceeded;
        }),
      );
    }
  }

  /**
   * Open the vocabulary tree modal popup.
   * When an entry is selected, add the filter query to the search options.
   */
  showVocabularyTree() {
    const modalRef: NgbModalRef = this.modalService.open(VocabularyTreeviewModalComponent, {
      size: 'lg',
      windowClass: 'treeview',
    });
    modalRef.componentInstance.vocabularyOptions = {
      name: this.getVocabularyEntry(),
      closed: true,
    };
    this.subs.push(from(modalRef.result).pipe(
      switchMap((detail: VocabularyEntryDetail) => this.searchConfigService.selectNewAppliedFilterParams(this.filterConfig.name, detail.value, 'equals')),
      take(1),
    ).subscribe((params: Params) => {
      void this.router.navigate(
        [this.searchService.getSearchLink()],
        {
          queryParams: params,
        },
      );
    }));
  }

  /**
   * Returns the matching vocabulary entry for the given search filter.
   * These are configurable in the config file.
   */
  getVocabularyEntry(): string {
    const foundVocabularyConfig: FilterVocabularyConfig[] = this.appConfig.vocabularies.filter((v: FilterVocabularyConfig) => v.filter === this.filterConfig.name);
    if (foundVocabularyConfig.length > 0 && foundVocabularyConfig[0].enabled === true) {
      return foundVocabularyConfig[0].vocabulary;
    }
  }
}
