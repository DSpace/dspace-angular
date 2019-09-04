import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { ITEM } from '../../../items/switcher/item-type-switcher.component';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { createRelationshipsObservable } from '../../../../+item-page/simple/item-types/shared/item.component.spec';
import { of as observableOf } from 'rxjs';
import { MetadataMap } from '../../../../core/shared/metadata.models';
import { TypedItemSearchResultGridElementComponent } from './typed-item-search-result-grid-element.component';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: [],
  relationships: createRelationshipsObservable()
});
const mockSearchResult = {
  indexableObject: mockItem as Item,
  hitHighlights: new MetadataMap()
} as ItemSearchResult;

describe('TypedItemSearchResultGridElementComponent', () => {
  let comp: TypedItemSearchResultGridElementComponent;
  let fixture: ComponentFixture<TypedItemSearchResultGridElementComponent>;

  describe('when injecting an Item', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [TypedItemSearchResultGridElementComponent, TruncatePipe],
        providers: [
          {provide: TruncatableService, useValue: {}},
          {provide: ITEM, useValue: mockItem}
        ],

        schemas: [NO_ERRORS_SCHEMA]
      }).overrideComponent(TypedItemSearchResultGridElementComponent, {
        set: {changeDetection: ChangeDetectionStrategy.Default}
      }).compileComponents();
    }));

    beforeEach(async(() => {
      fixture = TestBed.createComponent(TypedItemSearchResultGridElementComponent);
      comp = fixture.componentInstance;
    }));

    it('should initiate item, object and dso correctly', () => {
      expect(comp.item).toBe(mockItem);
      expect(comp.dso).toBe(mockItem);
      expect(comp.object.indexableObject).toBe(mockItem);
    })
  });

  describe('when injecting an ItemSearchResult', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [TypedItemSearchResultGridElementComponent, TruncatePipe],
        providers: [
          {provide: TruncatableService, useValue: {}},
          {provide: ITEM, useValue: mockSearchResult}
        ],

        schemas: [NO_ERRORS_SCHEMA]
      }).overrideComponent(TypedItemSearchResultGridElementComponent, {
        set: {changeDetection: ChangeDetectionStrategy.Default}
      }).compileComponents();
    }));

    beforeEach(async(() => {
      fixture = TestBed.createComponent(TypedItemSearchResultGridElementComponent);
      comp = fixture.componentInstance;
    }));

    it('should initiate item, object and dso correctly', () => {
      expect(comp.item).toBe(mockItem);
      expect(comp.dso).toBe(mockItem);
      expect(comp.object.indexableObject).toBe(mockItem);
    })
  });
});
