import { bitstreamWithoutThumbnail, mockThumbnail } from '../../../../../shared/mocks/bitstreams.mock';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { Item } from '../../../../../core/shared/item.model';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$
} from '../../../../../shared/remote-data.utils';
import { buildPaginatedList } from '../../../../../core/data/paginated-list.model';
import { PageInfo } from '../../../../../core/shared/page-info.model';
import { PersonSearchResultGridElementComponent } from './person-search-result-grid-element.component';
import {
  getEntityGridElementTestComponent,
  getGridElementTestBet
} from '../../../../../shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component.spec';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

const mockItemWithMetadata: ItemSearchResult = new ItemSearchResult();
mockItemWithMetadata.hitHighlights = {};
mockItemWithMetadata.indexableObject = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'person.email': [
      {
        language: 'en_US',
        value: 'Smith-Donald@gmail.com'
      }
    ],
    'person.jobTitle': [
      {
        language: 'en_US',
        value: 'Web Developer'
      }
    ]
  },
  thumbnail: createSuccessfulRemoteDataObject$(mockThumbnail)
});

const mockItemWithoutMetadata: ItemSearchResult = new ItemSearchResult();
mockItemWithoutMetadata.hitHighlights = {};
mockItemWithoutMetadata.indexableObject = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ]
  },
  thumbnail: createSuccessfulRemoteDataObject$(null)
});

const thumbnailConfig = {
  'name': 'cris.layout.thumbnail.maxsize',
  'values': ['50'],
  'type': 'property',
  '_links': {
    'self': {
      'href': 'http://localhost:8080/server/api/config/properties/cris.layout.thumbnail.maxsize'
    }
  }
};

const thumbnailConfigLess = {
  'name': 'cris.layout.thumbnail.maxsize',
  'values': ['5'],
  'type': 'property',
  '_links': {
    'self': {
      'href': 'http://localhost:8080/server/api/config/properties/cris.layout.thumbnail.maxsize'
    }
  }
};


describe('PersonSearchResultGridElementComponent', getEntityGridElementTestComponent(PersonSearchResultGridElementComponent, mockItemWithMetadata, mockItemWithoutMetadata, ['email', 'jobtitle']));

describe('PersonSearchResultGridElementComponent check different maxSize of thumbnail', () => {

  let component;
  let fixture: ComponentFixture<PersonSearchResultGridElementComponent>;
  let de: DebugElement;

  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {
    return TestBed.configureTestingModule(getGridElementTestBet(PersonSearchResultGridElementComponent));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonSearchResultGridElementComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.object = mockItemWithMetadata;
    component.thumbnailService.getConfig.and.returnValue(of(createSuccessfulRemoteDataObject(null)));
    component.bitstreamDataService.findAllByItemAndBundleName.and.returnValue(createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [bitstreamWithoutThumbnail])));
    fixture.detectChanges();
  });

  describe('When max size is bigger than the size of the bitstream', () => {

    beforeEach(() => {
      component.thumbnailService.getConfig.and.returnValue(of(createSuccessfulRemoteDataObject(thumbnailConfig)));
      component.object = mockItemWithoutMetadata;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show bitstream content image src', () => {
      const thum = fixture.debugElement.query(By.css('ds-themed-thumbnail'));
      expect(thum.nativeElement.thumbnail.id).toEqual('bitstream1');
    });

  });

  describe('When max size is smaller than the size of the bitstream', () => {

    beforeEach(() => {
      component.thumbnailService.getConfig.and.returnValue(of(createSuccessfulRemoteDataObject(thumbnailConfigLess)));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not show bitstream content image src', () => {
      const thum = fixture.debugElement.query(By.css('ds-themed-thumbnail'));
      expect(thum.nativeElement.thumbnail).toBeFalsy();
    });

  });

  describe('When max size is bigger than the size of the thumbnail', () => {

    beforeEach(() => {
      component.thumbnailService.getConfig.and.returnValue(of(createSuccessfulRemoteDataObject(thumbnailConfig)));
      component.object = mockItemWithMetadata;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show thumbnail content image src', () => {
      const thum = fixture.debugElement.query(By.css('ds-themed-thumbnail'));
      expect(thum.nativeElement.thumbnail.id).toEqual('thumbnail1');
    });

  });

  describe('When max size is smaller than the size of the thumbnail', () => {

    beforeEach(() => {
      component.thumbnailService.getConfig.and.returnValue(of(createSuccessfulRemoteDataObject(thumbnailConfigLess)));
      component.object = mockItemWithMetadata;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not show thumbnail content image src', () => {
      const thum = fixture.debugElement.query(By.css('ds-themed-thumbnail'));
      expect(thum.nativeElement.thumbnail).toBeFalsy();
    });

  });


});
