import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutCollectionBoxComponent } from './cris-layout-collection-box.component';
import { TranslateModule } from '@ngx-translate/core';
import { CrisLayoutBox } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';
import { Collection } from '../../../../../core/shared/collection.model';
import { CollectionDataService } from '../../../../../core/data/collection-data.service';
import { buildPaginatedList, PaginatedList } from '../../../../../core/data/paginated-list.model';
import { PageInfo } from '../../../../../core/shared/page-info.model';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';

describe('CrisLayoutCollectionBoxComponent', () => {
  let component: CrisLayoutCollectionBoxComponent;
  let fixture: ComponentFixture<CrisLayoutCollectionBoxComponent>;

  const createMockCollection = (id: string) => Object.assign(new Collection(), {
    id: id,
    name: `collection-${id}`,
  });

  const testBox = Object.assign(new CrisLayoutBox(), {
    'id': 1,
    'shortname': 'collections',
    'header': 'Collections',
    'entityType': 'Publication',
    'collapsed': false,
    'minor': false,
    'style': null,
    'security': 0,
    'boxType': 'COLLECTIONS',
    'maxColumns': null,
    'configuration': null,
    'metadataSecurityFields': [],
    'container': false
  });
  let collectionDataService;
  let mockCollection1: Collection;
  let mockPage1: PaginatedList<Collection>;

  const owningCollection = Object.assign(new Collection(), {uuid: 'test-collection-uuid'});

  const owningCollection$ = createSuccessfulRemoteDataObject$<Collection>(owningCollection);

  const testItem = Object.assign(new Item(), {
    type: 'item',
    owningCollection: owningCollection$,
    uuid: 'test-item-uuid',
  });

  mockCollection1 = createMockCollection('c1');

  beforeEach(async () => {
    collectionDataService = jasmine.createSpyObj([
      'findOwningCollectionFor',
      'findMappedCollectionsFor',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [CrisLayoutCollectionBoxComponent],
      providers: [
        { provide: 'boxProvider', useValue: testBox },
        { provide: 'itemProvider', useValue: testItem },
        { provide: CollectionDataService, useValue: collectionDataService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutCollectionBoxComponent);
    component = fixture.componentInstance;
    mockPage1 = buildPaginatedList(Object.assign(new PageInfo(), {
      currentPage: 1,
      elementsPerPage: 2,
      totalPages: 0,
      totalElements: 0,
    }), []);
    collectionDataService.findOwningCollectionFor.and.returnValue(createSuccessfulRemoteDataObject$(mockCollection1));
    collectionDataService.findMappedCollectionsFor.and.returnValue(createSuccessfulRemoteDataObject$(mockPage1));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render container', () => {
    expect(fixture.debugElement.query(By.css('.container'))).not.toBeNull();
  });

  describe('without collections', () => {
    beforeEach(() => {
      component.owningCollection$ = observableOf(null);
      fixture.detectChanges();
    });

    it('should not render container', () => {
      expect(fixture.debugElement.query(By.css('.container'))).toBeNull();
    });
  });

  describe('without owning collections', () => {
    beforeEach(() => {
      component.owningCollection$ = observableOf(null);
      fixture.detectChanges();
    });

    it('should not render owning collection row', () => {
      expect(fixture.debugElement.query(By.css('div[data-test="owningCollection"]'))).toBeNull();
    });
  });

  describe('with owning collections', () => {
    beforeEach(() => {
      component.owningCollection$ = observableOf(mockCollection1);
      fixture.detectChanges();
    });

    it('should render owning collection row', () => {
      expect(fixture.debugElement.query(By.css('div[data-test="owningCollection"]'))).not.toBeNull();
    });
  });

  describe('without mapped collections', () => {
    beforeEach(() => {
      component.mappedCollections$ = observableOf([]);
      fixture.detectChanges();
    });

    it('should not render mapped collections row', () => {
      expect(fixture.debugElement.query(By.css('div[data-test="mappedCollections"]'))).toBeNull();
    });
  });

  describe('with mapped collections', () => {
    beforeEach(() => {
      component.mappedCollections$ = observableOf([mockCollection1]);
      fixture.detectChanges();
    });

    it('should render mapped collection row', () => {
      expect(fixture.debugElement.query(By.css('div[data-test="mappedCollections"]'))).not.toBeNull();
    });
  });

});
