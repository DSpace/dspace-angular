import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CollectionDropdownComponent } from './collection-dropdown.component';
import { FollowLinkConfig } from '../utils/follow-link-config.model';
import { Observable, of } from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { PaginatedList } from 'src/app/core/data/paginated-list';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { createSuccessfulRemoteDataObject } from '../remote-data.utils';
import { PageInfo } from 'src/app/core/shared/page-info.model';
import { Collection } from '../../core/shared/collection.model';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef, ElementRef } from '@angular/core';
import { CollectionDataService } from 'src/app/core/data/collection-data.service';
import { FindListOptions } from 'src/app/core/data/request.models';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import { TestScheduler } from 'rxjs/testing';
import { By } from '@angular/platform-browser';
import { Community } from 'src/app/core/shared/community.model';

const community: Community = Object.assign(new Community(), {
  id: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
  uuid: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
  name: 'Community 1'
});

const collections: Collection[] = [
  Object.assign(new Collection(), {
    id: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
    name: 'Collection 1',
    metadata: [
      {
        key: 'dc.title',
        language: 'en_US',
        value: 'Community 1-Collection 1'
      }],
    parentCommunity: of(
      new RemoteData(false, false, true, undefined, community, 200)
    )
  }),
  Object.assign(new Collection(), {
    id: '59ee713b-ee53-4220-8c3f-9860dc84fe33',
    name: 'Collection 2',
    metadata: [
      {
        key: 'dc.title',
        language: 'en_US',
        value: 'Community 1-Collection 2'
      }],
    parentCommunity: of(
      new RemoteData(false, false, true, undefined, community, 200)
    )
  }),
  Object.assign(new Collection(), {
    id: 'e9dbf393-7127-415f-8919-55be34a6e9ed',
    name: 'Collection 3',
    metadata: [
      {
        key: 'dc.title',
        language: 'en_US',
        value: 'Community 1-Collection 3'
      }],
    parentCommunity: of(
      new RemoteData(false, false, true, undefined, community, 200)
    )
  }),
  Object.assign(new Collection(), {
    id: '59da2ff0-9bf4-45bf-88be-e35abd33f304',
    name: 'Collection 4',
    metadata: [
      {
        key: 'dc.title',
        language: 'en_US',
        value: 'Community 1-Collection 4'
      }],
    parentCommunity: of(
      new RemoteData(false, false, true, undefined, community, 200)
    )
  }),
  Object.assign(new Collection(), {
    id: 'a5159760-f362-4659-9e81-e3253ad91ede',
    name: 'Collection 5',
    metadata: [
      {
        key: 'dc.title',
        language: 'en_US',
        value: 'Community 1-Collection 5'
      }],
    parentCommunity: of(
      new RemoteData(false, false, true, undefined, community, 200)
    )
  })
];

const listElementMock = {
    communities: [
      {
        id: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
        name: 'Community 1'
      }
    ],
    collection: {
      id: 'e9dbf393-7127-415f-8919-55be34a6e9ed',
      uuid: 'e9dbf393-7127-415f-8919-55be34a6e9ed',
      name: 'Collection 3'
    }
  };

// tslint:disable-next-line: max-classes-per-file
class CollectionDataServiceMock {
  getAuthorizedCollection(query: string, options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<Collection>>): Observable<RemoteData<PaginatedList<Collection>>> {
    return of(
        createSuccessfulRemoteDataObject(
          new PaginatedList(new PageInfo(), collections)
        )
    );
  }
}

describe('CollectionDropdownComponent', () => {
  let component: CollectionDropdownComponent;
  let fixture: ComponentFixture<CollectionDropdownComponent>;
  let scheduler: TestScheduler;
  const searchedCollection = 'TEXT';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [ CollectionDropdownComponent ],
      providers: [
        {provide: CollectionDataService, useClass: CollectionDataServiceMock},
        {provide: ChangeDetectorRef, useValue: {}},
        {provide: ElementRef, userValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(CollectionDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should populate collections list with five items', () => {
    const elements = fixture.debugElement.queryAll(By.css('.collection-item'));
    expect(elements.length).toEqual(5);
  });

  it('should trigger onSelect method when select a new collection from list', fakeAsync(() => {
    spyOn(component, 'onSelect');
    const collectionItem = fixture.debugElement.query(By.css('.collection-item:nth-child(2)'));
    collectionItem.triggerEventHandler('click', null);
    fixture.detectChanges();
    tick();
    fixture.whenStable().then(() => {
      expect(component.onSelect).toHaveBeenCalled();
    });
  }));

  it('should init component with collection list', fakeAsync(() => {
    spyOn(component.subs, 'push').and.callThrough();
    spyOn(component, 'resetPagination').and.callThrough();
    spyOn(component, 'populateCollectionList').and.callThrough();
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.subs.push).toHaveBeenCalled();
      expect(component.resetPagination).toHaveBeenCalled();
      expect(component.populateCollectionList).toHaveBeenCalled();
    });
  }));

  it('should emit collectionChange event when selecting a new collection', () => {
    spyOn(component.selectionChange, 'emit').and.callThrough();
    component.ngOnInit();
    component.onSelect(listElementMock as any);
    fixture.detectChanges();

    expect(component.selectionChange.emit).toHaveBeenCalledWith(listElementMock as any);
  });

  it('should reset collections list after reset of searchField', fakeAsync(() => {
    spyOn(component.subs, 'push').and.callThrough();
    spyOn(component, 'reset').and.callThrough();
    spyOn(component.searchField, 'setValue').and.callThrough();
    spyOn(component, 'resetPagination').and.callThrough();
    spyOn(component, 'populateCollectionList').and.callThrough();
    component.reset();
    const input = fixture.debugElement.query(By.css('input.form-control'));
    const el = input.nativeElement;
    el.value = searchedCollection;
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(500);

    fixture.whenStable().then(() => {
      expect(component.reset).toHaveBeenCalled();
      expect(component.searchField.setValue).toHaveBeenCalledWith('');
      expect(component.resetPagination).toHaveBeenCalled();
      expect(component.currentQuery).toEqual('');
      expect(component.populateCollectionList).toHaveBeenCalledWith(component.currentQuery, component.currentPage);
      expect(component.searchListCollection).toEqual(collections as any);
      expect(component.subs.push).toHaveBeenCalled();
    });
  }));

  it('should reset searchField when dropdown menu has been closed', () => {
    spyOn(component.searchField, 'setValue').and.callThrough();
    component.reset();

    expect(component.searchField.setValue).toHaveBeenCalled();
  });

  it('should change loader status', () => {
    spyOn(component.isLoadingList, 'next').and.callThrough();
    component.hideShowLoader(true);

    expect(component.isLoadingList.next).toHaveBeenCalledWith(true);
  });

  it('reset pagination fields', () => {
    component.resetPagination();

    expect(component.currentPage).toEqual(1);
    expect(component.currentQuery).toEqual('');
    expect(component.hasNextPage).toEqual(true);
    expect(component.searchListCollection).toEqual([]);
  });
});
