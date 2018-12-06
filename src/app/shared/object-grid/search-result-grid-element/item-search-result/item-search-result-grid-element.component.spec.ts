import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of as observableOf } from 'rxjs';

import { ItemSearchResultGridElementComponent } from './item-search-result-grid-element.component';
import { Item } from '../../../../core/shared/item.model';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { TruncatePipe } from '../../../utils/truncate.pipe';

let itemSearchResultGridElementComponent: ItemSearchResultGridElementComponent;
let fixture: ComponentFixture<ItemSearchResultGridElementComponent>;

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
      itemSearchResultGridElementComponent.dso = mockItemWithAuthorAndDate.dspaceObject;
      fixture.detectChanges();
    });

    it('should show the author paragraph', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('p.item-authors'));
      expect(itemAuthorField).not.toBeNull();
    });
  });

  describe('When the item has no author', () => {
    beforeEach(() => {
      itemSearchResultGridElementComponent.dso = mockItemWithoutAuthorAndDate.dspaceObject;
      fixture.detectChanges();
    });

    it('should not show the author paragraph', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('p.item-authors'));
      expect(itemAuthorField).toBeNull();
    });
  });

  describe('When the item has an issuedate', () => {
    beforeEach(() => {
      itemSearchResultGridElementComponent.dso = mockItemWithAuthorAndDate.dspaceObject;
      fixture.detectChanges();
    });

    it('should show the issuedate span', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('span.item-date'));
      expect(itemAuthorField).not.toBeNull();
    });
  });

  describe('When the item has no issuedate', () => {
    beforeEach(() => {
      itemSearchResultGridElementComponent.dso = mockItemWithoutAuthorAndDate.dspaceObject;
      fixture.detectChanges();
    });

    it('should not show the issuedate span', () => {
      const dateField = fixture.debugElement.query(By.css('span.item-date'));
      expect(dateField).toBeNull();
    });
  });
});
