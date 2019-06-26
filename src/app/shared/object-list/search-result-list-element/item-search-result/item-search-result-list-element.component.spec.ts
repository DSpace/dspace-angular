import { ItemSearchResultListElementComponent } from './item-search-result-list-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { Item } from '../../../../core/shared/item.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { TranslateModule } from '@ngx-translate/core';

let itemSearchResultListElementComponent: ItemSearchResultListElementComponent;
let fixture: ComponentFixture<ItemSearchResultListElementComponent>;

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

const mockItemWithoutRelationshipType: ItemSearchResult = new ItemSearchResult();
mockItemWithoutRelationshipType.hitHighlights = {};
mockItemWithoutRelationshipType.indexableObject = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ]
  }
});

describe('ItemSearchResultListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule],
      declarations: [ItemSearchResultListElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: 'objectElementProvider', useValue: (mockItemWithoutRelationshipType) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemSearchResultListElementComponent);
    itemSearchResultListElementComponent = fixture.componentInstance;
  }));

  describe('When the item has a relationship type', () => {
    beforeEach(() => {
      itemSearchResultListElementComponent.object = mockItemWithRelationshipType;
      fixture.detectChanges();
    });

    it('should show the relationship type badge', () => {
      const badge = fixture.debugElement.query(By.css('span.badge'));
      expect(badge.nativeElement.textContent).toContain(type.toLowerCase());
    });
  });

  describe('When the item has no relationship type', () => {
    beforeEach(() => {
      itemSearchResultListElementComponent.object = mockItemWithoutRelationshipType;
      fixture.detectChanges();
    });

    it('should not show a badge', () => {
      const badge = fixture.debugElement.query(By.css('span.badge'));
      expect(badge).toBeNull();
    });
  });
});
