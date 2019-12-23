import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of as observableOf } from 'rxjs';
import { Params, Router } from '@angular/router';
import { SearchLabelComponent } from './search-label.component';
import { ObjectKeysPipe } from '../../../utils/object-keys-pipe';
import { SEARCH_CONFIG_SERVICE } from '../../../../+my-dspace-page/my-dspace-page.component';
import { SearchServiceStub } from '../../../testing/search-service-stub';
import { SearchConfigurationServiceStub } from '../../../testing/search-configuration-service-stub';
import { SearchService } from '../../../../core/shared/search/search.service';

describe('SearchLabelComponent', () => {
  let comp: SearchLabelComponent;
  let fixture: ComponentFixture<SearchLabelComponent>;

  const searchLink = '/search';
  let searchService;

  const key1 = 'author';
  const key2 = 'subject';
  const value1 = 'Test, Author';
  const normValue1 = 'Test, Author';
  const value2 = 'TestSubject';
  const value3 = 'Test, Authority,authority';
  const normValue3 = 'Test, Authority';
  const filter1 = [key1, value1];
  const filter2 = [key2, value2];
  const mockFilters = [
    filter1,
    filter2
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule],
      declarations: [SearchLabelComponent, ObjectKeysPipe],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub(searchLink) },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() },
        { provide: Router, useValue: {}}
        // { provide: SearchConfigurationService, useValue: {getCurrentFrontendFilters : () =>  observableOf({})} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchLabelComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLabelComponent);
    comp = fixture.componentInstance;
    searchService = (comp as any).searchService;
    comp.key = key1;
    comp.value = value1;
    (comp as any).appliedFilters = observableOf(mockFilters);
    fixture.detectChanges();
  });

  describe('when getRemoveParams is called', () => {
    let obs: Observable<Params>;

    beforeEach(() => {
      obs = comp.getRemoveParams();
    });

    it('should return all params but the provided filter', () => {
      obs.subscribe((params) => {
        // Should contain only filter2 and page: length == 2
        expect(Object.keys(params).length).toBe(2);
      });
    })
  });

  describe('when normalizeFilterValue is called', () => {
    it('should return properly filter value', () => {
      let result: string;

      result = comp.normalizeFilterValue(value1);
      expect(result).toBe(normValue1);

      result = comp.normalizeFilterValue(value3);
      expect(result).toBe(normValue3);
    })
  });
});
