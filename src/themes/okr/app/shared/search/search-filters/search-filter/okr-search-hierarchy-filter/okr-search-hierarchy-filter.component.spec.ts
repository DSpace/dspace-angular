import { OkrSearchHierarchyFilterComponent } from './okr-search-hierarchy-filter.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { VocabularyService } from '../../../../../../../../app/core/submission/vocabularies/vocabulary.service';
import { of as observableOf } from 'rxjs';
import { RemoteData } from '../../../../../../../../app/core/data/remote-data';
import { RequestEntryState } from '../../../../../../../../app/core/data/request.reducer';
import { TranslateModule } from '@ngx-translate/core';
import { RouterStub } from '../../../../../../../../app/shared/testing/router.stub';
import { buildPaginatedList } from '../../../../../../../../app/core/data/paginated-list.model';
import { PageInfo } from '../../../../../../../../app/core/shared/page-info.model';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../../../../../../app/core/shared/search/search.service';
import {
  FILTER_CONFIG,
  IN_PLACE_SEARCH,
  SearchFilterService
} from '../../../../../../../../app/core/shared/search/search-filter.service';
import { RemoteDataBuildService } from '../../../../../../../../app/core/cache/builders/remote-data-build.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../../../app/my-dspace-page/my-dspace-page.component';
import { SearchConfigurationServiceStub } from '../../../../../../../../app/shared/testing/search-configuration-service.stub';
import { VocabularyEntryDetail } from '../../../../../../../../app/core/submission/vocabularies/models/vocabulary-entry-detail.model';
import { FacetValue } from '../../../../../../../../app/shared/search/facet-value.model';
import { SearchFilterConfig } from '../../../../../../../../app/shared/search/search-filter-config.model';

describe('OkrSearchHierarchyFilterComponent', () => {

  let fixture: ComponentFixture<OkrSearchHierarchyFilterComponent>;
  let showVocabularyTreeLink: DebugElement;

  const testSearchLink = 'test-search';
  const testSearchFilter = 'test-search-filter';
  const okrVocabularyTreeViewComponent = {
    select: new EventEmitter<VocabularyEntryDetail>(),
  };

  const searchService = {
    getSearchLink: () => testSearchLink,
    getFacetValuesFor: () => observableOf([]),
  };
  const searchFilterService = {
    getPage: () => observableOf(0),
  };
  const router = new RouterStub();
  const ngbModal = jasmine.createSpyObj('modal', {
    open: {
      componentInstance: okrVocabularyTreeViewComponent,
    }
  });
  const vocabularyService = {
    searchTopEntries: () => undefined,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgbModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        OkrSearchHierarchyFilterComponent,
      ],
      providers: [
        { provide: SearchService, useValue: searchService },
        { provide: SearchFilterService, useValue: searchFilterService },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: Router, useValue: router },
        { provide: NgbModal, useValue: ngbModal },
        { provide: VocabularyService, useValue: vocabularyService },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() },
        { provide: IN_PLACE_SEARCH, useValue: false },
        { provide: FILTER_CONFIG, useValue: Object.assign(new SearchFilterConfig(), { name: testSearchFilter }) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  function init() {
    fixture = TestBed.createComponent(OkrSearchHierarchyFilterComponent);
    fixture.detectChanges();
    showVocabularyTreeLink = fixture.debugElement.query(By.css('div#show-test-search-filter-tree'));
  }

  describe('if the vocabulary doesn\'t exist', () => {

    beforeEach(() => {
      spyOn(vocabularyService, 'searchTopEntries').and.returnValue(observableOf(new RemoteData(
        undefined, 0, 0, RequestEntryState.Error, undefined, undefined, 404
      )));
      init();
    });

    it('should not show the vocabulary tree link', () => {
      expect(showVocabularyTreeLink).toBeNull();
    });
  });

  describe('if the vocabulary exists', () => {

    beforeEach(() => {
      spyOn(vocabularyService, 'searchTopEntries').and.returnValue(observableOf(new RemoteData(
        undefined, 0, 0, RequestEntryState.Success, undefined, buildPaginatedList(new PageInfo(), []), 200
      )));
      init();
    });

    it('should show the vocabulary tree link', () => {
      expect(showVocabularyTreeLink).toBeTruthy();
    });

    describe('when clicking the vocabulary tree link', () => {

      beforeEach(async () => {
        showVocabularyTreeLink.nativeElement.click();
      });

      it('should open the vocabulary tree modal', () => {
        expect(ngbModal.open).toHaveBeenCalled();
      });

      describe('when selecting a value from the vocabulary tree', () => {

        const alreadySelectedValues = [
          'already-selected-value-1',
          'already-selected-value-2',
        ];
        const newSelectedValue = 'new-selected-value';

        beforeEach(() => {
          fixture.componentInstance.selectedValues$ = observableOf(
            alreadySelectedValues.map(value => Object.assign(new FacetValue(), { value }))
          );
          okrVocabularyTreeViewComponent.select.emit(Object.assign(new VocabularyEntryDetail(), {
            value: newSelectedValue,
          }));
        });

        it('should add a new search filter to the existing search filters', () => {
          expect(router.navigate).toHaveBeenCalledWith([testSearchLink], {
            queryParams: {
              [`f.${testSearchFilter}`]: [
                ...alreadySelectedValues,
                newSelectedValue,
              ].map((value => `${value},equals`)),
            },
            queryParamsHandling: 'merge',
          });
        });
      });
    });
  });
});
