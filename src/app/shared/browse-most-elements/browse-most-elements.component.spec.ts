import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { BrowseMostElementsComponent } from './browse-most-elements.component';
import { SearchManager } from '../../core/browse/search-manager';
import { PaginatedSearchOptions } from '../search/models/paginated-search-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { APP_CONFIG } from '../../../config/app-config.interface';
import { ItemSearchResult } from '../object-collection/shared/item-search-result.model';
import { Item } from '../../core/shared/item.model';
import { createSuccessfulRemoteDataObject } from '../remote-data.utils';
import { buildPaginatedList } from '../../core/data/paginated-list.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { followLink } from '../utils/follow-link-config.model';

describe('BrowseMostElementsComponent', () => {
  let component: BrowseMostElementsComponent;
  let fixture: ComponentFixture<BrowseMostElementsComponent>;


  const mockResultObject: ItemSearchResult = new ItemSearchResult();
  mockResultObject.hitHighlights = {};

  mockResultObject.indexableObject = Object.assign(new Item(), {
    bundles: of({}),
    metadata: {
      'dc.title': [
        {
          language: 'en_US',
          value: 'This is just another title'
        }
      ],
      'dc.type': [
        {
          language: null,
          value: 'Article'
        }
      ],
      'dc.contributor.author': [
        {
          language: 'en_US',
          value: 'Smith, Donald'
        }
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '2015-06-26'
        }
      ]
    }
  });
  const mockResponse = createSuccessfulRemoteDataObject(buildPaginatedList(new PageInfo(), [mockResultObject]));

  const mockSearchService = {
    search: jasmine.createSpy('search').and.returnValue(of(mockResponse)), // Replace with your desired response
  };

  const mockConfig = {
    browseBy: {
      showThumbnails: true
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BrowseMostElementsComponent],
      providers: [
        { provide: APP_CONFIG, useValue: mockConfig },
        { provide: SearchManager, useValue: mockSearchService },
        { provide: ChangeDetectorRef, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Ignore unknown Angular elements
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseMostElementsComponent);
    component = fixture.componentInstance;
    component.paginatedSearchOptions = new PaginatedSearchOptions({
      configuration: 'test',
      pagination: Object.assign(new PaginationComponentOptions(), {
        id: 'search-object-pagination',
        pageSize: 5,
        currentPage: 1
      }),
      sort: new SortOptions('dc.title', SortDirection.ASC)
    });
  });

  it('should create', () => {
    component.showThumbnails = true;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call searchService.search on ngOnInit with followLinks', () => {
    component.showThumbnails = true;
    fixture.detectChanges();

    expect(mockSearchService.search).toHaveBeenCalledWith(
      component.paginatedSearchOptions,
      null,
      true,
      true,
      followLink('thumbnail')
    );
  });

  it('should call searchService.search on ngOnInit with followLinks', () => {
    component.showThumbnails = undefined;
    fixture.detectChanges();

    expect(mockSearchService.search).toHaveBeenCalledWith(
      component.paginatedSearchOptions,
      null,
      true,
      true,
      followLink('thumbnail')
    );
  });

  it('should call searchService.search on ngOnInit without followLinks', () => {
    component.showThumbnails = false;
    fixture.detectChanges();

    expect(mockSearchService.search).toHaveBeenCalledWith(
      component.paginatedSearchOptions,
      null,
      true,
      true
    );
  });

  it('should update searchResults after searchService response', () => {
    component.ngOnInit();

    expect(component.searchResults).toEqual(mockResponse);
  });
});
