import { thumbnail } from './../../../../../shared/mocks/bitstreams.mock';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { Item } from '../../../../../core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';
import { buildPaginatedList } from '../../../../../core/data/paginated-list.model';
import { PageInfo } from '../../../../../core/shared/page-info.model';
import { PersonSearchResultGridElementComponent } from './person-search-result-grid-element.component';
import { getEntityGridElementTestComponent, getGridElementTestBet } from '../../../../../shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component.spec';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

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
  thumbnail: thumbnail
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
  thumbnail: thumbnail
});

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
    // mockBitstreamDataService.findAllByItemAndBundleName.and.returnValue(of([]));
    // mockThumbnailService.getConfig.and.returnValue(of(createSuccessfulRemoteDataObject(null)));
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

});
