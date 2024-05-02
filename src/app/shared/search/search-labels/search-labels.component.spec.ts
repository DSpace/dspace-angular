import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { SearchService } from '../../../core/shared/search/search.service';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-configuration.service';
import { SearchServiceStub } from '../../testing/search-service.stub';
import { ObjectKeysPipe } from '../../utils/object-keys-pipe';
import { SearchLabelComponent } from './search-label/search-label.component';
import { SearchLabelsComponent } from './search-labels.component';

describe('SearchLabelsComponent', () => {
  let comp: SearchLabelsComponent;
  let fixture: ComponentFixture<SearchLabelsComponent>;

  const searchLink = '/search';
  let searchService;

  const field1 = 'author';
  const field2 = 'subject';
  const value1 = 'Test, Author';
  const value2 = 'TestSubject';
  const filter1 = [field1, value1];
  const filter2 = [field2, value2];
  const mockFilters = [
    filter1,
    filter2,
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule, RouterTestingModule, SearchLabelsComponent, ObjectKeysPipe],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub(searchLink) },
        { provide: SEARCH_CONFIG_SERVICE, useValue: { getCurrentFrontendFilters: () => observableOf(mockFilters) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(SearchLabelsComponent, {
      remove: {
        imports: [SearchLabelComponent],
      },
      add: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLabelsComponent);
    comp = fixture.componentInstance;
    searchService = (comp as any).searchService;
    (comp as any).appliedFilters = observableOf(mockFilters);
    fixture.detectChanges();
  });

  describe('when the component has been initialized', () => {
    it('should return all params but the provided filter', () => {
      comp.appliedFilters.subscribe((filters) => {
        expect(filters).toBe(mockFilters);
      });
    });
  });
});
