import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchComponent} from './search.component';
import {LuckySearchService} from "../lucky-search.service";
import {SearchConfigurationService} from "../../core/shared/search/search-configuration.service";
import {Router, UrlTree} from "@angular/router";
import {createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$} from "../../shared/remote-data.utils";
import {createPaginatedList} from "../../shared/testing/utils.test";
import {Item} from "../../core/shared/item.model";
import {of as observableOf} from "rxjs/internal/observable/of";
import {PaginatedSearchOptions} from "../../shared/search/paginated-search-options.model";
import {PaginationComponentOptions} from "../../shared/pagination/pagination-component-options.model";
import {SortDirection, SortOptions} from "../../core/cache/models/sort-options.model";
import {TranslateModule} from "@ngx-translate/core";
import {By} from "@angular/platform-browser";

describe('SearchComponent', () => {
  let fixture: ComponentFixture<SearchComponent>;
  const collection1 = Object.assign(new Item(), {
    uuid: 'item-uuid-1',
    name: 'Test item 1'
  });
  const collection2 = Object.assign(new Item(), {
    uuid: 'item-uuid-2',
    name: 'Test item 2'
  });
  const searchServiceStub = jasmine.createSpyObj('LuckySearchService', {
    getSearchLink: 'lucky-search',

    sendRequest: createSuccessfulRemoteDataObject$(createPaginatedList([
      {
        indexableObject: collection1,
        hitHighlights: {}
      }, {
        indexableObject: collection2,
        hitHighlights: {}
      }
    ]))
  });
  const mockSearchOptions = observableOf(new PaginatedSearchOptions({
    pagination: Object.assign(new PaginationComponentOptions(), {
      id: 'search-page-configuration',
      pageSize: 10,
      currentPage: 1
    }),
    sort: new SortOptions('dc.title', SortDirection.ASC)
  }));
  const searchConfigServiceStub = {
    paginatedSearchOptions: mockSearchOptions
  };
  let component: SearchComponent;

  const itemPageUrl = '/lucky-search?index=xxx&value=yyyy';
  let urlTree = new UrlTree();
  urlTree.queryParams = {
    index: 'test',
    'value': 'test'
  };
  const routerStub = jasmine.createSpyObj('router', {
    parseUrl: urlTree,
    createUrlTree: new UrlTree(),
    url: itemPageUrl
  });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        {provide: Router, useValue: routerStub},
        {provide: SearchConfigurationService, useValue: searchConfigServiceStub},
        {provide: LuckySearchService, useValue: searchServiceStub},

      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show multiple results', () => {
    expect(component.showMultipleSearchSection).toEqual(true);
  });

  it('should display basic search form', () => {
    expect(fixture.debugElement.query(By.css('ds-search-results')))
      .toBeTruthy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    let data = createSuccessfulRemoteDataObject(createPaginatedList([
    ]))
    component.resultsRD$.next(data as any)
    fixture.detectChanges();
  });

  it('should show multiple results', () => {
    expect(component.showEmptySearchSection).toEqual(true);
  });

  it('should display basic search form', () => {
    expect(fixture.debugElement.query(By.css('ds-search-form')))
      .toBeTruthy();
  });
  beforeEach(() => {
    debugger
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    let data = createSuccessfulRemoteDataObject(createPaginatedList([
      collection1
    ]))
    component.resultsRD$.next(data as any)
    fixture.detectChanges();
  });

  it('should show multiple results', () => {
    spyOn(component, 'redirectToItemsDetailPage');
  });

});
