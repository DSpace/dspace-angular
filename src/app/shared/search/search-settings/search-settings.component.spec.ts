import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import {
  SortDirection,
  SortOptions,
} from '../../../../../modules/core/src/lib/core/cache/models/sort-options.model';
import { PaginationService } from '../../../../../modules/core/src/lib/core/pagination/pagination.service';
import { PaginationComponentOptions } from '../../../../../modules/core/src/lib/core/shared/pagination-component-options.model';
import { SearchService } from '../../../../../modules/core/src/lib/core/shared/search/search.service';
import { SearchFilterService } from '../../../../../modules/core/src/lib/core/shared/search/search-filter.service';
import { ActivatedRouteStub } from '../../../../../modules/core/src/lib/core/utilities/testing/active-router.stub';
import { PaginationServiceStub } from '../../../../../modules/core/src/lib/core/utilities/testing/pagination-service.stub';
import { SearchServiceStub } from '../../../../../modules/core/src/lib/core/utilities/testing/search-service.stub';
import { SidebarServiceStub } from '../../../../../modules/core/src/lib/core/utilities/testing/sidebar-service.stub';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-configuration.service';
import { SidebarService } from '../../sidebar/sidebar.service';
import { EnumKeysPipe } from '../../utils/enum-keys-pipe';
import { VarDirective } from '../../utils/var.directive';
import { SearchSettingsComponent } from './search-settings.component';

describe('SearchSettingsComponent', () => {

  let comp: SearchSettingsComponent;
  let fixture: ComponentFixture<SearchSettingsComponent>;

  let pagination: PaginationComponentOptions;
  let sort: SortOptions;

  let queryParam;
  let scopeParam;
  let paginatedSearchOptions;

  let paginationService: PaginationServiceStub;


  beforeEach(waitForAsync(async () => {
    pagination = new PaginationComponentOptions();
    pagination.id = 'search-results-pagination';
    pagination.currentPage = 1;
    pagination.pageSize = 10;
    sort = new SortOptions('score', SortDirection.DESC);

    queryParam = 'test query';
    scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
    paginatedSearchOptions = {
      query: queryParam,
      scope: scopeParam,
      pagination,
      sort,
    };

    paginationService = new PaginationServiceStub(pagination, sort);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), SearchSettingsComponent, EnumKeysPipe, VarDirective],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        {
          provide: SidebarService,
          useValue: SidebarServiceStub,
        },
        {
          provide: SearchFilterService,
          useValue: {},
        },
        {
          provide: PaginationService,
          useValue: paginationService,
        },
        {
          provide: SEARCH_CONFIG_SERVICE,
          useValue: {
            paginatedSearchOptions: observableOf(paginatedSearchOptions),
            getCurrentScope: observableOf('test-id'),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSettingsComponent);
    comp = fixture.componentInstance;

    comp.sortOptionsList = [
      new SortOptions('score', SortDirection.DESC),
      new SortOptions('dc.title', SortDirection.ASC),
      new SortOptions('dc.title', SortDirection.DESC),
    ];
    comp.currentSortOption = new SortOptions('score', SortDirection.DESC);

    // SearchPageComponent test instance
    fixture.detectChanges();
    spyOn(comp, 'reloadOrder');
  });

  it('it should show the order settings with the respective selectable options', () => {
    fixture.detectChanges();
    const orderSetting = fixture.debugElement.query(By.css('div.result-order-settings'));
    expect(orderSetting).toBeDefined();
    const childElements = orderSetting.queryAll(By.css('option'));
    expect(childElements.length).toEqual(comp.sortOptionsList.length);
  });

  it('it should show the size settings', () => {
    fixture.detectChanges();
    const pageSizeSetting = fixture.debugElement.query(By.css('page-size-settings'));
    expect(pageSizeSetting).toBeDefined();
  });

  it('should have the proper order value selected by default', () => {
    fixture.detectChanges();
    const orderSetting = fixture.debugElement.query(By.css('div.result-order-settings'));
    const childElementToBeSelected = orderSetting.query(By.css('option[value="score,DESC"]'));
    expect(childElementToBeSelected).not.toBeNull();
    expect(childElementToBeSelected.nativeElement.selected).toBeTrue();
  });
});
