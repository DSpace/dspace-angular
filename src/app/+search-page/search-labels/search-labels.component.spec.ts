import { SearchLabelsComponent } from './search-labels.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SearchService } from '../search-service/search.service';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchServiceStub } from '../../shared/testing/search-service-stub';
import { Observable } from 'rxjs/Observable';
import { FilterLabel } from '../search-service/filter-label.model';
import { Params } from '@angular/router';

describe('SearchLabelsComponent', () => {
  let comp: SearchLabelsComponent;
  let fixture: ComponentFixture<SearchLabelsComponent>;

  const searchLink = '/search';
  let searchService;

  const field1 = 'author';
  const field2 = 'subject';
  const value1 = 'TestAuthor';
  const value2 = 'TestSubject';
  const filter1 = new FilterLabel(value1, field1);
  const filter2 = new FilterLabel(value2, field2);
  const mockFilters = [
    filter1,
    filter2
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule],
      declarations: [SearchLabelsComponent],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub(searchLink) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchLabelsComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLabelsComponent);
    comp = fixture.componentInstance;
    searchService = (comp as any).searchService;
    (comp as any).appliedFilters = Observable.of(mockFilters);
    fixture.detectChanges();
  });

  describe('when getRemoveParams is called', () => {
    let obs: Observable<Params>;

    beforeEach(() => {
      obs = comp.getRemoveParams(filter1);
    });

    it('should return all params but the provided filter', () => {
      obs.subscribe((params) => {
        // Should contain only filter2 and page: length == 2
        expect(Object.keys(params).length).toBe(2);
      });
    })
  });
});
