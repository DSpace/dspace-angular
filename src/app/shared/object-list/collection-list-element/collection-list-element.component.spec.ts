import { CollectionListElementComponent } from './collection-list-element.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Collection } from '../../../core/shared/collection.model';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../mocks/dso-name.service.mock';

let collectionListElementComponent: CollectionListElementComponent;
let fixture: ComponentFixture<CollectionListElementComponent>;

const mockCollectionWithArchivedItems: Collection = Object.assign(new Collection(), {
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'Test title'
      }
    ]
  }, archivedItemsCount: 1
});

const mockCollectionWithArchivedItemsDisabledAtBackend: Collection = Object.assign(new Collection(), {
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'Test title'
      }
    ]
  }, archivedItemsCount: -1
});


const mockCollectionWithAbstract: Collection = Object.assign(new Collection(), {
  metadata: {
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'Short description'
      }
    ]
  }, archivedItemsCount: 1
});

const mockCollectionWithoutAbstract: Collection = Object.assign(new Collection(), {
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'Test title'
      }
    ]
  }, archivedItemsCount: 1
});

describe('CollectionListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionListElementComponent],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: 'objectElementProvider', useValue: (mockCollectionWithAbstract) }
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CollectionListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CollectionListElementComponent);
    collectionListElementComponent = fixture.componentInstance;
  }));

  describe('When the collection has an abstract', () => {
    beforeEach(() => {
      collectionListElementComponent.object = mockCollectionWithAbstract;
      fixture.detectChanges();
    });

    it('should show the description paragraph', () => {
      const collectionAbstractField = fixture.debugElement.query(By.css('div.abstract-text'));
      expect(collectionAbstractField).not.toBeNull();
    });
  });

  describe('When the collection has no abstract', () => {
    beforeEach(() => {
      collectionListElementComponent.object = mockCollectionWithoutAbstract;
      fixture.detectChanges();
    });

    it('should not show the description paragraph', () => {
      const collectionAbstractField = fixture.debugElement.query(By.css('div.abstract-text'));
      expect(collectionAbstractField).toBeNull();
    });
  });


  describe('When the collection has archived items', () => {
    beforeEach(() => {
      collectionListElementComponent.object = mockCollectionWithArchivedItems;
      fixture.detectChanges();
    });

    it('should show the archived items paragraph', () => {
      const field = fixture.debugElement.query(By.css('span.archived-items-lead'));
      expect(field).not.toBeNull();
    });
  });

  describe('When the collection archived items are disabled at backend', () => {
    beforeEach(() => {
      collectionListElementComponent.object = mockCollectionWithArchivedItemsDisabledAtBackend;
      fixture.detectChanges();
    });

    it('should not show the archived items paragraph', () => {
      const field = fixture.debugElement.query(By.css('span.archived-items-lead'));
      expect(field).toBeNull();
    });
  });
});
