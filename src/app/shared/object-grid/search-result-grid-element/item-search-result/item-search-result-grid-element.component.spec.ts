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

let itemSearchResultGridElementComponent: ItemSearchResultGridElementComponent;
let fixture: ComponentFixture<ItemSearchResultGridElementComponent>;

const truncatableServiceStub: any = {
  isCollapsed: (id: number) => observableOf(true),
};

const mockItemWithAuthorAndDate: ItemSearchResult = new ItemSearchResult();
mockItemWithAuthorAndDate.hitHighlights = {};
mockItemWithAuthorAndDate.indexableObject = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald'
      }
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26'
      }
    ]
  }
});

const mockItemWithoutAuthorAndDate: ItemSearchResult = new ItemSearchResult();
mockItemWithoutAuthorAndDate.hitHighlights = {};
mockItemWithoutAuthorAndDate.indexableObject = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dc.type': [
      {
        language: null,
        value: 'Article'
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
        { provide: 'objectElementProvider', useValue: (mockItemWithoutAuthorAndDate) }
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

  describe('When the item has an author', () => {
    beforeEach(() => {
      itemSearchResultGridElementComponent.dso = mockItemWithAuthorAndDate.indexableObject;
      fixture.detectChanges();
    });

    it('should show the author paragraph', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('p.item-authors'));
      expect(itemAuthorField).not.toBeNull();
    });
  });

  describe('When the item has no author', () => {
    beforeEach(() => {
      itemSearchResultGridElementComponent.dso = mockItemWithoutAuthorAndDate.indexableObject;
      fixture.detectChanges();
    });

    it('should not show the author paragraph', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('p.item-authors'));
      expect(itemAuthorField).toBeNull();
    });
  });

  describe('When the item has an issuedate', () => {
    beforeEach(() => {
      itemSearchResultGridElementComponent.dso = mockItemWithAuthorAndDate.indexableObject;
      fixture.detectChanges();
    });

    it('should show the issuedate span', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('span.item-date'));
      expect(itemAuthorField).not.toBeNull();
    });
  });

  describe('When the item has no issuedate', () => {
    beforeEach(() => {
      itemSearchResultGridElementComponent.dso = mockItemWithoutAuthorAndDate.indexableObject;
      fixture.detectChanges();
    });

    it('should not show the issuedate span', () => {
      const dateField = fixture.debugElement.query(By.css('span.item-date'));
      expect(dateField).toBeNull();
    });
  });
});
