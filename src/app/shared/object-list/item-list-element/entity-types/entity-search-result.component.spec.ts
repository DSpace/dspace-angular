import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { EntitySearchResultComponent } from './entity-search-result-component';
import { Item } from '../../../../core/shared/item.model';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { ITEM } from '../../../entities/switcher/entity-type-switcher.component';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { createRelationshipsObservable } from '../../../../+item-page/simple/entity-types/shared/entity.component.spec';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: Observable.of(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: [],
  relationships: createRelationshipsObservable()
});
const mockSearchResult = {
  dspaceObject: mockItem as Item,
  hitHighlights: []
} as ItemSearchResult;

describe('EntitySearchResultComponent', () => {
  let comp: EntitySearchResultComponent;
  let fixture: ComponentFixture<EntitySearchResultComponent>;

  describe('when injecting an Item', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [EntitySearchResultComponent, TruncatePipe],
        providers: [
          {provide: TruncatableService, useValue: {}},
          {provide: ITEM, useValue: mockItem}
        ],

        schemas: [NO_ERRORS_SCHEMA]
      }).overrideComponent(EntitySearchResultComponent, {
        set: {changeDetection: ChangeDetectionStrategy.Default}
      }).compileComponents();
    }));

    beforeEach(async(() => {
      fixture = TestBed.createComponent(EntitySearchResultComponent);
      comp = fixture.componentInstance;
    }));

    it('should initiate item, object and dso correctly', () => {
      expect(comp.item).toBe(mockItem);
      expect(comp.dso).toBe(mockItem);
      expect(comp.object.dspaceObject).toBe(mockItem);
    })
  });

  describe('when injecting an ItemSearchResult', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [EntitySearchResultComponent, TruncatePipe],
        providers: [
          {provide: TruncatableService, useValue: {}},
          {provide: ITEM, useValue: mockSearchResult}
        ],

        schemas: [NO_ERRORS_SCHEMA]
      }).overrideComponent(EntitySearchResultComponent, {
        set: {changeDetection: ChangeDetectionStrategy.Default}
      }).compileComponents();
    }));

    beforeEach(async(() => {
      fixture = TestBed.createComponent(EntitySearchResultComponent);
      comp = fixture.componentInstance;
    }));

    it('should initiate item, object and dso correctly', () => {
      expect(comp.item).toBe(mockItem);
      expect(comp.dso).toBe(mockItem);
      expect(comp.object.dspaceObject).toBe(mockItem);
    })
  });
});
