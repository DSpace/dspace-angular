import { SearchService } from '../search-service/search.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchSettingsComponent } from './search-settings.component';
import { Observable } from 'rxjs/Observable';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { SearchSidebarService } from '../search-sidebar/search-sidebar.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EnumKeysPipe } from '../../shared/utils/enum-keys-pipe';
import { By } from '@angular/platform-browser';
import { SearchFilterService } from '../search-filters/search-filter/search-filter.service';
import { hot } from 'jasmine-marbles';
import { VarDirective } from '../../shared/utils/var.directive';
import { SearchConfigurationService } from '../search-service/search-configuration.service';

describe('SearchSettingsComponent', () => {

  let comp: SearchSettingsComponent;
  let fixture: ComponentFixture<SearchSettingsComponent>;
  let searchServiceObject: SearchService;

  const pagination: PaginationComponentOptions = new PaginationComponentOptions();
  pagination.id = 'search-results-pagination';
  pagination.currentPage = 1;
  pagination.pageSize = 10;
  const sort: SortOptions = new SortOptions('score', SortDirection.DESC);
  const mockResults = ['test', 'data'];
  const searchServiceStub = {
    searchOptions: { pagination: pagination, sort: sort },
    search: () => mockResults
  };

  const queryParam = 'test query';
  const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
  const paginatedSearchOptions = {
    query: queryParam,
    scope: scopeParam,
    pagination,
    sort
  };

  const activatedRouteStub = {
    queryParams: Observable.of({
      query: queryParam,
      scope: scopeParam
    })
  };

  const sidebarService = {
    isCollapsed: Observable.of(true),
    collapse: () => this.isCollapsed = Observable.of(true),
    expand: () => this.isCollapsed = Observable.of(false)
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      declarations: [SearchSettingsComponent, EnumKeysPipe, VarDirective],
      providers: [
        { provide: SearchService, useValue: searchServiceStub },

        { provide: ActivatedRoute, useValue: activatedRouteStub },
        {
          provide: SearchSidebarService,
          useValue: sidebarService
        },
        {
          provide: SearchFilterService,
          useValue: {}
        },
        {
          provide: SearchConfigurationService,
          useValue: {
            paginatedSearchOptions: hot('a', {
              a: paginatedSearchOptions
            }),
            getCurrentScope: hot('a', {
              a: 'test-id'
            }),
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSettingsComponent);
    comp = fixture.componentInstance;

    // SearchPageComponent test instance
    fixture.detectChanges();
    searchServiceObject = (comp as any).service;
    spyOn(comp, 'reloadRPP');
    spyOn(comp, 'reloadOrder');
    spyOn(searchServiceObject, 'search').and.callThrough();

  });

  it('it should show the order settings with the respective selectable options', () => {
    (comp as any).searchOptions$.first().subscribe((options) => {
      fixture.detectChanges();
      const orderSetting = fixture.debugElement.query(By.css('div.result-order-settings'));
      expect(orderSetting).toBeDefined();
      const childElements = orderSetting.query(By.css('.form-control')).children;
      expect(childElements.length).toEqual(comp.searchOptionPossibilities.length);
    });
  });

  it('it should show the size settings with the respective selectable options', () => {
    (comp as any).searchOptions$.first().subscribe((options) => {
        fixture.detectChanges();
        const pageSizeSetting = fixture.debugElement.query(By.css('div.page-size-settings'));
        expect(pageSizeSetting).toBeDefined();
        const childElements = pageSizeSetting.query(By.css('.form-control')).children;
        expect(childElements.length).toEqual(options.pagination.pageSizeOptions.length);
      }
    )
  });

  it('should have the proper order value selected by default', () => {
    (comp as any).searchOptions$.first().subscribe((options) => {
      fixture.detectChanges();
      const orderSetting = fixture.debugElement.query(By.css('div.result-order-settings'));
      const childElementToBeSelected = orderSetting.query(By.css('.form-control option[value="0"][selected="selected"]'));
      expect(childElementToBeSelected).toBeDefined();
    });
  });

  it('should have the proper rpp value selected by default', () => {
    (comp as any).searchOptions$.first().subscribe((options) => {
      fixture.detectChanges();
      const pageSizeSetting = fixture.debugElement.query(By.css('div.page-size-settings'));
      const childElementToBeSelected = pageSizeSetting.query(By.css('.form-control option[value="10"][selected="selected"]'));
      expect(childElementToBeSelected).toBeDefined();
    });
  });

});
