import { Item } from '../../../../core/shared/item.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ItemSearchResultListElementComponent } from './item-search-result-list-element.component';
import { of as observableOf } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { createRelationshipsObservable } from '../../../../+item-page/simple/entity-types/shared/entity.component.spec';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { of as observableOf } from 'rxjs';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: observableOf(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: [],
  relationships: createRelationshipsObservable()
});

describe('ItemSearchResultListElementComponent', () => {
  let comp: ItemSearchResultListElementComponent;
  let fixture: ComponentFixture<ItemSearchResultListElementComponent>;

  const truncatableServiceStub: any = {
    isCollapsed: (id: number) => observableOf(true),
  };

  const mockItemWithAuthorAndDate: ItemSearchResult = new ItemSearchResult();
  mockItemWithAuthorAndDate.hitHighlights = [];
  mockItemWithAuthorAndDate.dspaceObject = Object.assign(new Item(), {
    bitstreams: observableOf({}),
    metadata: [
      {
        key: 'dc.contributor.author',
        language: 'en_US',
        value: 'Smith, Donald'
      },
      {
        key: 'dc.date.issued',
        language: null,
        value: '2015-06-26'
      }]
  });

  const mockItemWithoutAuthorAndDate: ItemSearchResult = new ItemSearchResult();
  mockItemWithoutAuthorAndDate.hitHighlights = [];
  mockItemWithoutAuthorAndDate.dspaceObject = Object.assign(new Item(), {
    bitstreams: observableOf({}),
    metadata: [
      {
        key: 'dc.title',
        language: 'en_US',
        value: 'This is just another title'
      },
      {
        key: 'dc.type',
        language: null,
        value: 'Article'
      }]
  });

  describe('ItemSearchResultListElementComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [ItemSearchResultListElementComponent, TruncatePipe],
        providers: [
          { provide: TruncatableService, useValue: {} },
          { provide: 'objectElementProvider', useValue: mockItem }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).overrideComponent(ItemSearchResultListElementComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      }).compileComponents();
    }));

    beforeEach(async(() => {
      fixture = TestBed.createComponent(ItemSearchResultListElementComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
    }));

    it('should call an entity-type-switcher component and pass the item', () => {
      const entityTypeSwitcher = fixture.debugElement.query(By.css('ds-entity-type-switcher')).componentInstance;
      expect(entityTypeSwitcher.object).toBe(mockItem);
    });

  });
});
