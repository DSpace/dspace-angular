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

describe('ItemSearchResultListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule],
      declarations: [ItemSearchResultListElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: 'objectElementProvider', useValue: (mockItemWithRelationshipType) }
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

  it('should show a badge on top of the list element', () => {
    const badge = fixture.debugElement.query(By.css('ds-item-type-badge')).componentInstance;
    expect(badge.object).toBe(mockItemWithRelationshipType);
  });
});
