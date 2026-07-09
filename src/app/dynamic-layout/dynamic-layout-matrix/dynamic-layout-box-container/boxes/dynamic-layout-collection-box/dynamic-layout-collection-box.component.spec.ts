import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CollectionDataService } from '@dspace/core/data/collection-data.service';
import {
  buildPaginatedList,
  PaginatedList,
} from '@dspace/core/data/paginated-list.model';
import { DynamicLayoutBox } from '@dspace/core/layout/models/box.model';
import { Collection } from '@dspace/core/shared/collection.model';
import { Item } from '@dspace/core/shared/item.model';
import { PageInfo } from '@dspace/core/shared/page-info.model';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DynamicLayoutCollectionBoxComponent } from './dynamic-layout-collection-box.component';

describe('DynamicLayoutCollectionBoxComponent', () => {
  let component: DynamicLayoutCollectionBoxComponent;
  let fixture: ComponentFixture<DynamicLayoutCollectionBoxComponent>;

  const createMockCollection = (id: string) => Object.assign(new Collection(), {
    id: id,
    name: `collection-${id}`,
  });

  const testBox = Object.assign(new DynamicLayoutBox(), {
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
    'container': false,
  });
  let collectionDataService;
  let mockCollection1: Collection;
  let mockPage1: PaginatedList<Collection>;

  const owningCollection = Object.assign(new Collection(), { uuid: 'test-collection-uuid' });

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
        DynamicLayoutCollectionBoxComponent,
      ],
      providers: [
        { provide: 'boxProvider', useValue: testBox },
        { provide: 'itemProvider', useValue: testItem },
        { provide: CollectionDataService, useValue: collectionDataService },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLayoutCollectionBoxComponent);
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
      component.owningCollection$ = of(null);
      fixture.detectChanges();
    });

    it('should not render container', () => {
      expect(fixture.debugElement.query(By.css('.container'))).toBeNull();
    });
  });

  describe('without owning collections', () => {
    beforeEach(() => {
      component.owningCollection$ = of(null);
      fixture.detectChanges();
    });

    it('should not render owning collection row', () => {
      expect(fixture.debugElement.query(By.css('div[data-test="owningCollection"]'))).toBeNull();
    });
  });

  describe('with owning collections', () => {
    beforeEach(() => {
      component.owningCollection$ = of(mockCollection1);
      fixture.detectChanges();
    });

    it('should render owning collection row', () => {
      expect(fixture.debugElement.query(By.css('div[data-test="owningCollection"]'))).not.toBeNull();
    });
  });

  describe('without mapped collections', () => {
    beforeEach(() => {
      component.mappedCollections$ = of([]);
      fixture.detectChanges();
    });

    it('should not render mapped collections row', () => {
      expect(fixture.debugElement.query(By.css('div[data-test="mappedCollections"]'))).toBeNull();
    });
  });

  describe('with mapped collections', () => {
    beforeEach(() => {
      component.mappedCollections$ = of([mockCollection1]);
      fixture.detectChanges();
    });

    it('should render mapped collection row', () => {
      expect(fixture.debugElement.query(By.css('div[data-test="mappedCollections"]'))).not.toBeNull();
    });
  });

});
