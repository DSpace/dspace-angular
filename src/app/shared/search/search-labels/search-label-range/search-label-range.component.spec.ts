import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Params,
  RouterModule,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { PaginationService } from '@dspace/core';
import { PaginationComponentOptions } from '@dspace/core';
import { AppliedFilter } from '@dspace/core';
import { SearchService } from '@dspace/core';
import { SearchConfigurationService } from '@dspace/core';
import { SearchFilterService } from '@dspace/core';
import { ActivatedRouteStub } from '@dspace/core';
import { PaginationServiceStub } from '@dspace/core';
import { SearchConfigurationServiceStub } from '@dspace/core';
import { SearchFilterServiceStub } from '@dspace/core';
import { SearchServiceStub } from '@dspace/core';
import { addOperatorToFilterValue } from '../../../../../../modules/core/src/lib/core/utilities/search.utils';
import { SearchLabelRangeComponent } from './search-label-range.component';

describe('SearchLabelRangeComponent', () => {
  let comp: SearchLabelRangeComponent;
  let fixture: ComponentFixture<SearchLabelRangeComponent>;

  let route: ActivatedRouteStub;
  let searchConfigurationService: SearchConfigurationServiceStub;
  let searchFilterService: SearchFilterServiceStub;
  let paginationService: PaginationServiceStub;

  const searchLink = '/search';
  let appliedFilter: AppliedFilter;
  let initialRouteParams: Params;
  let pagination: PaginationComponentOptions;

  function init(): void {
    appliedFilter = Object.assign(new AppliedFilter(), {
      filter: 'author',
      operator: 'authority',
      value: '1282121b-5394-4689-ab93-78d537764052',
      label: 'Odinson, Thor',
    });
    initialRouteParams = {
      'query': '',
      'page-id.page': '5',
      'f.author': addOperatorToFilterValue(appliedFilter.value, appliedFilter.operator),
      'f.has_content_in_original_bundle': addOperatorToFilterValue('true', 'equals'),
    };
    pagination = Object.assign(new PaginationComponentOptions(), {
      id: 'page-id',
      currentPage: 1,
      pageSize: 20,
    });
  }

  beforeEach(waitForAsync(async () => {
    init();
    route = new ActivatedRouteStub(initialRouteParams);
    searchConfigurationService = new SearchConfigurationServiceStub();
    searchFilterService = new SearchFilterServiceStub();
    paginationService = new PaginationServiceStub(pagination);

    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: PaginationService, useValue: paginationService },
        { provide: SearchConfigurationService, useValue: searchConfigurationService },
        { provide: SearchService, useValue: new SearchServiceStub(searchLink) },
        { provide: SearchFilterService, useValue: searchFilterService },
        { provide: ActivatedRoute, useValue: route },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLabelRangeComponent);
    comp = fixture.componentInstance;
    comp.appliedFilter = appliedFilter;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });
});
