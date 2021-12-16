import { Component, Inject } from '@angular/core';
import { renderFacetFor } from '../../../../../../../../app/shared/search/search-filters/search-filter/search-filter-type-decorator';
import { FilterType } from '../../../../../../../../app/shared/search/filter-type.model';
import { facetLoad } from '../../../../../../../../app/shared/search/search-filters/search-filter/search-facet-filter/search-facet-filter.component';
import { SearchHierarchyFilterComponent } from '../../../../../../../../app/shared/search/search-filters/search-filter/search-hierarchy-filter/search-hierarchy-filter.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OkrVocabularyTreeviewComponent } from '../../../../okr-vocabulary-treeview/okr-vocabulary-treeview.component';
import { VocabularyEntryDetail } from '../../../../../../../../app/core/submission/vocabularies/models/vocabulary-entry-detail.model';
import { SearchService } from '../../../../../../../../app/core/shared/search/search.service';
import {
  FILTER_CONFIG,
  IN_PLACE_SEARCH,
  SearchFilterService
} from '../../../../../../../../app/core/shared/search/search-filter.service';
import { Router } from '@angular/router';
import { RemoteDataBuildService } from '../../../../../../../../app/core/cache/builders/remote-data-build.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../../../app/my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../../../../app/core/shared/search/search-configuration.service';
import { SearchFilterConfig } from '../../../../../../../../app/shared/search/search-filter-config.model';
import { FacetValue } from '../../../../../../../../app/shared/search/facet-value.model';
import { getFacetValueForType } from '../../../../../../../../app/shared/search/search.utils';
import { filter, map, take } from 'rxjs/operators';
import { VocabularyService } from '../../../../../../../../app/core/submission/vocabularies/vocabulary.service';
import { Observable } from 'rxjs';
import { PageInfo } from '../../../../../../../../app/core/shared/page-info.model';

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
      this.filterConfig.name, new PageInfo(), true, false,
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
      name: this.filterConfig.name,
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
}
