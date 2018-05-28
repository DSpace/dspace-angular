import { CollectionsComponent } from './collections.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Collection } from '../../../core/shared/collection.model';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { getMockRemoteDataBuildService } from '../../../shared/mocks/mock-remote-data-build.service';
import { Item } from '../../../core/shared/item.model';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { TranslateModule } from '@ngx-translate/core';

let collectionsComponent: CollectionsComponent;
let fixture: ComponentFixture<CollectionsComponent>;

const mockCollection1: Collection = Object.assign(new Collection(), {
  metadata: [
    {
      key: 'dc.description.abstract',
      language: 'en_US',
      value: 'Short description'
    }]
});

const succeededMockItem: Item = Object.assign(new Item(), {owningCollection: Observable.of(new RemoteData(false, false, true, null, mockCollection1))});
const failedMockItem: Item = Object.assign(new Item(), {owningCollection: Observable.of(new RemoteData(false, false, false, null, mockCollection1))});

describe('CollectionsComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ CollectionsComponent ],
      providers: [
        { provide: RemoteDataBuildService, useValue: getMockRemoteDataBuildService()}
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

  describe('When the requested item request has succeeded', () => {
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
