import { ItemSearchResultGridElementComponent } from './item-search-result-grid-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { Item } from '../../../../core/shared/item.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { ItemViewMode } from '../../../items/item-type-decorator';

let itemSearchResultGridElementComponent: ItemSearchResultGridElementComponent;
let fixture: ComponentFixture<ItemSearchResultGridElementComponent>;

const truncatableServiceStub: any = {
  isCollapsed: (id: number) => observableOf(true),
};

const type = 'authorOfPublication';

const mockItemWithRelationshipType: ItemSearchResult = new ItemSearchResult();
mockItemWithRelationshipType.hitHighlights = {};
mockItemWithRelationshipType.indexableObject = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'relationship.type': [
      {
        language: 'en_US',
        value: type
      }
    ]
  }
});

describe('ItemSearchResultGridElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [ItemSearchResultGridElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: 'objectElementProvider', useValue: (mockItemWithRelationshipType) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemSearchResultGridElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemSearchResultGridElementComponent);
    itemSearchResultGridElementComponent = fixture.componentInstance;
  }));

  it('should show send the object to item-type-switcher using viewMode "Card"', () => {
    const itemTypeSwitcherComp = fixture.debugElement.query(By.css('ds-item-type-switcher')).componentInstance;
    expect(itemTypeSwitcherComp.object).toBe(mockItemWithRelationshipType);
    expect(itemTypeSwitcherComp.viewMode).toEqual(ItemViewMode.Card);
  });
});
