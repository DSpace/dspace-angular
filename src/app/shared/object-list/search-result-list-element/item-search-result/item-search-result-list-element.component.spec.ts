import { ItemSearchResultListElementComponent } from './item-search-result-list-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { NO_ERRORS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { Item } from '../../../../core/shared/item.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';

let itemSearchResultListElementComponent: ItemSearchResultListElementComponent;
let fixture: ComponentFixture<ItemSearchResultListElementComponent>;

const truncatableServiceStub: any = {
  isCollapsed: (id: number) => Observable.of(true),
};

const mockItemWithAuthorAndDate: ItemSearchResult = new ItemSearchResult();
mockItemWithAuthorAndDate.hitHighlights = [];
mockItemWithAuthorAndDate.dspaceObject = Object.assign(new Item(), {
  bitstreams: Observable.of({}),
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
  bitstreams: Observable.of({}),
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
      imports: [NoopAnimationsModule],
      declarations: [ItemSearchResultListElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: 'objectElementProvider', useValue: (mockItemWithoutAuthorAndDate) }
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

  describe('When the item has an author', () => {
    beforeEach(() => {
      itemSearchResultListElementComponent.dso = mockItemWithAuthorAndDate.dspaceObject;
      fixture.detectChanges();
    });

    it('should show the author paragraph', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('span.item-list-authors'));
      expect(itemAuthorField).not.toBeNull();
    });
  });

  describe('When the item has no author', () => {
    beforeEach(() => {
      itemSearchResultListElementComponent.dso = mockItemWithoutAuthorAndDate.dspaceObject;
      fixture.detectChanges();
    });

    it('should not show the author paragraph', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('span.item-list-authors'));
      expect(itemAuthorField).toBeNull();
    });
  });

  describe('When the item has an issuedate', () => {
    beforeEach(() => {
      itemSearchResultListElementComponent.dso = mockItemWithAuthorAndDate.dspaceObject;
      fixture.detectChanges();
    });

    it('should show the issuedate span', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('span.item-list-date'));
      expect(itemAuthorField).not.toBeNull();
    });
  });

  describe('When the item has no issuedate', () => {
    beforeEach(() => {
      itemSearchResultListElementComponent.dso = mockItemWithoutAuthorAndDate.dspaceObject;
      fixture.detectChanges();
    });

    it('should not show the issuedate span', () => {
      const dateField = fixture.debugElement.query(By.css('span.item-list-date'));
      expect(dateField).toBeNull();
    });
  });
});
