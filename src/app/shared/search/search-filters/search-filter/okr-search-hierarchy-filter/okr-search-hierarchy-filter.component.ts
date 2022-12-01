import { Component, Inject } from '@angular/core';
import { renderFacetFor } from '../search-filter-type-decorator';
import { FilterType } from '../../../models/filter-type.model';
import { facetLoad } from '../search-facet-filter/search-facet-filter.component';
import { SearchHierarchyFilterComponent } from '../search-hierarchy-filter/search-hierarchy-filter.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OkrVocabularyTreeviewComponent } from '../../../../okr-vocabulary-treeview/okr-vocabulary-treeview.component';
import { VocabularyEntryDetail } from '../../../../../core/submission/vocabularies/models/vocabulary-entry-detail.model';
import { SearchService } from '../../../../../core/shared/search/search.service';
import {
  FILTER_CONFIG,
  IN_PLACE_SEARCH,
  SearchFilterService
} from '../../../../../core/shared/search/search-filter.service';
import { Router } from '@angular/router';
import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { SearchFilterConfig } from '../../../models/search-filter-config.model';
import { FacetValue } from '../../../models/facet-value.model';
import { getFacetValueForType } from '../../../search.utils';
import { filter, map, take } from 'rxjs/operators';
import { VocabularyService } from '../../../../../core/submission/vocabularies/vocabulary.service';
import { Observable } from 'rxjs';
import { PageInfo } from '../../../../../core/shared/page-info.model';
import { environment } from '../../../../../../environments/environment';

/**
 * Component that represents a hierarchy facet for a specific filter configuration.
 * Worldbank customization which features a link at the bottom to open a vocabulary popup,
 */
@Component({
  selector: 'ds-okr-search-hierarchy-filter',
  styleUrls: ['./okr-search-hierarchy-filter.component.scss'],
  templateUrl: './okr-search-hierarchy-filter.component.html',
  animations: [facetLoad]
})
@renderFacetFor(FilterType.hierarchy)
export class OkrSearchHierarchyFilterComponent extends SearchHierarchyFilterComponent {

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected rdbs: RemoteDataBuildService,
              protected router: Router,
              protected modalService: NgbModal,
              protected vocabularyService: VocabularyService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              @Inject(IN_PLACE_SEARCH) public inPlaceSearch: boolean,
              @Inject(FILTER_CONFIG) public filterConfig: SearchFilterConfig,
  ) {
    super(
      searchService,
      filterService,
      rdbs,
      router,
      searchConfigService,
      inPlaceSearch,
      filterConfig,
    );
  }

  vocabularyExists$: Observable<boolean>;

  ngOnInit() {
    super.ngOnInit();
    this.vocabularyExists$ = this.vocabularyService.searchTopEntries(
      this.getVocabularyEntry(), new PageInfo(), true, false,
    ).pipe(
      filter(rd => rd.hasCompleted),
      take(1),
      map(rd => {
        return rd.hasSucceeded;
      }),
    );
  }

  /**
   * Open the vocabulary tree modal popup.
   * When an entry is selected, add the filter query to the search options.
   */
  showVocabularyTree() {
    const modalRef: NgbModalRef = this.modalService.open(OkrVocabularyTreeviewComponent, {
      size: 'lg',
      windowClass: 'treeview'
    });
    modalRef.componentInstance.vocabularyOptions = {
      name: this.getVocabularyEntry(),
      closed: true
    };
    modalRef.componentInstance.select.subscribe((detail: VocabularyEntryDetail) => {
      this.selectedValues$
        .pipe(take(1))
        .subscribe((selectedValues) => {
          this.router.navigate(
            [this.searchService.getSearchLink()],
            {
              queryParams: {
                [this.filterConfig.paramName]: [...selectedValues, {value: detail.value}]
                  .map((facetValue: FacetValue) => getFacetValueForType(facetValue, this.filterConfig)),
              },
              queryParamsHandling: 'merge',
            },
          );
        });
    });
  }

  /**
   * Returns the matching vocabulary entry for the given search filter.
   * These are configurable in the config file.
   */
  getVocabularyEntry() {
    const foundVocabularyConfig = environment.vocabularies.filter((v) => v.filter === this.filterConfig.name);
    if (foundVocabularyConfig.length > 0 && foundVocabularyConfig[0].enabled === true) {
      return foundVocabularyConfig[0].vocabulary;
    }
  }
}
