import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { Collection } from '../../../core/shared/collection.model';
import { Item } from '../../../core/shared/item.model';
import { getMockRemoteDataBuildService } from '../../../shared/mocks/mock-remote-data-build.service';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject$ } from '../../../shared/testing/utils';
import { CollectionsComponent } from './collections.component';

let collectionsComponent: CollectionsComponent;
let fixture: ComponentFixture<CollectionsComponent>;

let collectionDataServiceStub;

const mockCollection1: Collection = Object.assign(new Collection(), {
  metadata: {
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'Short description'
      }
    ]
  }
});

const succeededMockItem: Item = Object.assign(new Item(), {owningCollection: createSuccessfulRemoteDataObject$(mockCollection1)});
const failedMockItem: Item = Object.assign(new Item(), {owningCollection: createFailedRemoteDataObject$(mockCollection1)});

describe('CollectionsComponent', () => {
  collectionDataServiceStub = {
    findOwningCollectionFor(item: Item) {
      if (item === succeededMockItem) {
        return createSuccessfulRemoteDataObject$(mockCollection1);
      } else {
        return createFailedRemoteDataObject$(mockCollection1);
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ CollectionsComponent ],
      providers: [
        { provide: RemoteDataBuildService, useValue: getMockRemoteDataBuildService()},
        { provide: CollectionDataService, useValue: collectionDataServiceStub },
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(CollectionsComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CollectionsComponent);
    collectionsComponent = fixture.componentInstance;
    collectionsComponent.label = 'test.test';
    collectionsComponent.separator = '<br/>';

  }));

  describe('When the requested item request has succeeded', () => {
    beforeEach(() => {
      collectionsComponent.item = succeededMockItem;
      fixture.detectChanges();
    });

    it('should show the collection', () => {
      const collectionField = fixture.debugElement.query(By.css('ds-metadata-field-wrapper div.collections'));
      expect(collectionField).not.toBeNull();
    });
  });

  describe('When the requested item request has failed', () => {
    beforeEach(() => {
      collectionsComponent.item = failedMockItem;
      fixture.detectChanges();
    });

    it('should not show the collection', () => {
      const collectionField = fixture.debugElement.query(By.css('ds-metadata-field-wrapper div.collections'));
      expect(collectionField).toBeNull();
    });
  });
});
