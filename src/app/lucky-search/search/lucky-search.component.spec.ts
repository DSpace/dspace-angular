import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuckySearchComponent } from './lucky-search.component';
import { LuckySearchService } from '../lucky-search.service';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { Router, UrlTree } from '@angular/router';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { Item } from '../../core/shared/item.model';
import { of as observableOf } from 'rxjs';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { SearchResult } from '../../shared/search/models/search-result.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { BitstreamDataService, MetadataFilter } from '../../core/data/bitstream-data.service';
import { Bitstream } from '../../core/shared/bitstream.model';
import { RouterMock } from '../../shared/mocks/router.mock';
import { MetadataMap, MetadataValue } from '../../core/shared/metadata.models';
import { FileSizePipe } from '../../shared/utils/file-size-pipe';

describe('SearchComponent', () => {
  let fixture: ComponentFixture<LuckySearchComponent>;
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
  const bitstreamDataService = jasmine.createSpyObj('bitstreamDataService', {
    findByItem: jasmine.createSpy('findByItem')
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
  let component: LuckySearchComponent;

  const urlTree = new UrlTree();
  urlTree.queryParams = {
    index: 'test',
    'value': 'test'
  };
  const routerStub = new RouterMock();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LuckySearchComponent, FileSizePipe],
      imports: [TranslateModule.forRoot()],
      providers: [
        {provide: Router, useValue: routerStub},
        {provide: SearchConfigurationService, useValue: searchConfigServiceStub},
        {provide: LuckySearchService, useValue: searchServiceStub},
        {provide: BitstreamDataService, useValue: bitstreamDataService}
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LuckySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('should search items', () => {

    beforeEach(() => {
      spyOn(routerStub, 'parseUrl').and.returnValue(urlTree);
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
      fixture = TestBed.createComponent(LuckySearchComponent);
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
      fixture = TestBed.createComponent(LuckySearchComponent);
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

  describe('should search bitstreams', () => {

    const bitstreamMetadata = {
      'dc.title': [{ value: 'test.pdf' } as MetadataValue],
      'dc.description': [{ value: 'TestDescription' } as MetadataValue]
    } as MetadataMap;
    const bitstream = Object.assign(
      new Bitstream(),
      { _name: 'test.pdf', sizeBytes: 15, uuid: 'fa272dbf-e458-4ad2-868b-b4a27c6eac15', metadata: bitstreamMetadata }
    ) as Bitstream;

    beforeEach(() => {
      fixture = TestBed.createComponent(LuckySearchComponent);
      component = fixture.componentInstance;

      const bitstreamSearchTree = new UrlTree();
      bitstreamSearchTree.queryParams = {
        index: 'testIndex',
        value: 'testValue',
        bitstreamMetadata: 'testMetadata',
        bitstreamValue: 'testMetadataValue'
      };

      const itemUUID = 'd317835d-7b06-4219-91e2-1191900cb897';
      const firstSearchResult = Object.assign(new SearchResult(), {
        indexableObject: Object.assign(new DSpaceObject(), {
          id: 'd317835d-7b06-4219-91e2-1191900cb897',
          uuid: itemUUID,
          name: 'My first publication',
          metadata: {
            'dspace.entity.type': [
              { value: 'Publication' }
            ]
          }
        })
      });
      const data = createSuccessfulRemoteDataObject(createPaginatedList([firstSearchResult]));
      const metadataFilters = [{ metadataName: 'dc.title', metadataValue: 'test.pdf' }] as MetadataFilter[];
      component.bitstreamFilters$.next(metadataFilters);
      bitstreamDataService.findByItem.withArgs(itemUUID, 'ORIGINAL', metadataFilters, {})
        .and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList([bitstream])));

      spyOn(component, 'redirect');
      spyOn(component.bitstreams$, 'next').and.callThrough();
      spyOn(routerStub, 'parseUrl').and.returnValue(bitstreamSearchTree);

      component.resultsRD$.next(data as any);

      fixture.detectChanges();
    });

    it('should load item bitstreams', () => {
      expect(component.bitstreams$.next).toHaveBeenCalledWith([bitstream]);
    });

    it('should redirect to bitstream', () => {
      expect(component.redirect).toHaveBeenCalledWith(`/bitstreams/${bitstream.uuid}/download`);
    });

    it('should return bitstream filename', () => {
      expect(component.fileName(bitstream)).toEqual('test.pdf');
    });

    it('should return bitstream description', () => {
      expect(component.getDescription(bitstream)).toEqual('TestDescription');
    });

    it('should return bitstream file size', () => {
      expect(component.getSize(bitstream)).toEqual(15);
    });
  });
});
