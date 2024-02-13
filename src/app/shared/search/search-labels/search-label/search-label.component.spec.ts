import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Params, ActivatedRoute } from '@angular/router';
import { SearchLabelComponent } from './search-label.component';
import { SearchServiceStub } from '../../../testing/search-service.stub';
import { SearchService } from '../../../../core/shared/search/search.service';
import { ActivatedRouteStub } from '../../../testing/active-router.stub';
import { AppliedFilter } from '../../models/applied-filter.model';
import { addOperatorToFilterValue } from '../../search.utils';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { SearchConfigurationServiceStub } from '../../../testing/search-configuration-service.stub';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../../testing/pagination-service.stub';
import { PaginationComponentOptions } from '../../../pagination/pagination-component-options.model';
import { of as observableOf } from 'rxjs';
import { take } from 'rxjs/operators';

describe('SearchLabelComponent', () => {
  let comp: SearchLabelComponent;
  let fixture: ComponentFixture<SearchLabelComponent>;

  let route: ActivatedRouteStub;
  let searchConfigurationService: SearchConfigurationServiceStub;
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
      'spc.page': '1',
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
    paginationService = new PaginationServiceStub(pagination);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        SearchLabelComponent,
      ],
      providers: [
        { provide: PaginationService, useValue: paginationService },
        { provide: SearchConfigurationService, useValue: searchConfigurationService },
        { provide: SearchService, useValue: new SearchServiceStub(searchLink) },
        { provide: ActivatedRoute, useValue: route },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLabelComponent);
    comp = fixture.componentInstance;
    comp.appliedFilter = appliedFilter;
    fixture.detectChanges();
  });

  describe('updateRemoveParams', () => {
    it('should always reset the page to 1', (done: DoneFn) => {
      spyOn(searchConfigurationService, 'unselectAppliedFilterParams').and.returnValue(observableOf(initialRouteParams));

      comp.updateRemoveParams().pipe(take(1)).subscribe((params: Params) => {
        expect(params).toEqual(Object.assign({}, initialRouteParams, {
          'page-id.page': 1,
        }));
        done();
      });
    });
  });
});
