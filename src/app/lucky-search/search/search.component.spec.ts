import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchComponent} from './search.component';
import {LuckySearchService} from '../lucky-search.service';
import {SearchConfigurationService} from '../../core/shared/search/search-configuration.service';
import {Router, UrlTree} from '@angular/router';
import {createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$} from '../../shared/remote-data.utils';
import {createPaginatedList} from '../../shared/testing/utils.test';
import {Item} from '../../core/shared/item.model';
import {of as observableOf} from 'rxjs/internal/observable/of';
import {PaginatedSearchOptions} from '../../shared/search/paginated-search-options.model';
import {PaginationComponentOptions} from '../../shared/pagination/pagination-component-options.model';
import {SortDirection, SortOptions} from '../../core/cache/models/sort-options.model';
import {TranslateModule} from '@ngx-translate/core';
import {By} from '@angular/platform-browser';
import {SearchResult} from '../../shared/search/search-result.model';
import {DSpaceObject} from '../../core/shared/dspace-object.model';

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
  const urlTree = new UrlTree();
  urlTree.queryParams = {
    index: 'test',
    'value': 'test'
  };
  const routerStub = jasmine.createSpyObj('router', {
    parseUrl: urlTree,
    createUrlTree: new UrlTree(),
    url: itemPageUrl,
    // tslint:disable-next-line:no-unused-expression
    navigateByUrl: void {}
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

  it('should display basic search form results', () => {
    expect(fixture.debugElement.query(By.css('ds-search-results')))
      .toBeTruthy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    const firstSearchResult = Object.assign(new SearchResult(), {
      indexableObject: Object.assign(new DSpaceObject(), {
        id: 'd317835d-7b06-4219-91e2-1191900cb897',
        uuid: 'd317835d-7b06-4219-91e2-1191900cb897',
        name: 'My first publication',
        metadata: {
          'dspace.entity.type': [
            {value: 'Publication'}
          ]
        }
      })
    });

    const data = createSuccessfulRemoteDataObject(createPaginatedList([
      firstSearchResult
    ]));
    component.resultsRD$.next(data as any);
    fixture.detectChanges();
  });

  it('should call navigate or router', () => {
    expect(routerStub.navigateByUrl).toHaveBeenCalled();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    const data = createSuccessfulRemoteDataObject(createPaginatedList([]));
    component.resultsRD$.next(data as any);
    fixture.detectChanges();
  });

  it('should not have results', () => {
    expect(component.showEmptySearchSection).toEqual(true);
  });

  it('should display basic search form', () => {
    expect(fixture.debugElement.query(By.css('ds-search-form')))
      .toBeTruthy();
  });
});
