import { ItemSearchResult } from '../../object-collection/shared/item-search-result.model';
import { Item } from '../../../core/shared/item.model';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TruncatePipe } from '../../utils/truncate.pipe';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ItemTypeBadgeComponent } from './item-type-badge.component';
import { By } from '@angular/platform-browser';

let comp: ItemTypeBadgeComponent;
let fixture: ComponentFixture<ItemTypeBadgeComponent>;

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

describe('ItemTypeBadgeComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ItemTypeBadgeComponent, TruncatePipe],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemTypeBadgeComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemTypeBadgeComponent);
    comp = fixture.componentInstance;
  }));

  describe('When the item has a relationship type', () => {
    beforeEach(() => {
      comp.object = mockItemWithRelationshipType;
      fixture.detectChanges();
    });

    it('should show the relationship type badge', () => {
      const badge = fixture.debugElement.query(By.css('span.badge'));
      expect(badge.nativeElement.textContent).toContain(type.toLowerCase());
    });
  });

  describe('When the item has no relationship type', () => {
    beforeEach(() => {
      comp.object = mockItemWithoutRelationshipType;
      fixture.detectChanges();
    });

    it('should not show a badge', () => {
      const badge = fixture.debugElement.query(By.css('span.badge'));
      expect(badge).toBeNull();
    });
  });
});
