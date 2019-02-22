import { ItemListElementComponent } from './item-list-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TruncatePipe } from '../../utils/truncate.pipe';
import { Item } from '../../../core/shared/item.model';
import { of as observableOf } from 'rxjs';

let itemListElementComponent: ItemListElementComponent;
let fixture: ComponentFixture<ItemListElementComponent>;

const mockItemWithAuthorAndDate: Item = Object.assign(new Item(), {
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
const mockItemWithoutAuthorAndDate: Item = Object.assign(new Item(), {
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

describe('ItemListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemListElementComponent , TruncatePipe],
      providers: [
        { provide: 'objectElementProvider', useValue: {mockItemWithAuthorAndDate}}
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(ItemListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemListElementComponent);
    itemListElementComponent = fixture.componentInstance;

  }));

  describe('When the item has an author', () => {
    beforeEach(() => {
      itemListElementComponent.object = mockItemWithAuthorAndDate;
      fixture.detectChanges();
    });

    it('should show the author paragraph', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('span.item-list-authors'));
      expect(itemAuthorField).not.toBeNull();
    });
  });

  describe('When the item has no author', () => {
    beforeEach(() => {
      itemListElementComponent.object = mockItemWithoutAuthorAndDate;
      fixture.detectChanges();
    });

    it('should not show the author paragraph', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('span.item-list-authors'));
      expect(itemAuthorField).toBeNull();
    });
  });

  describe('When the item has an issuedate', () => {
    beforeEach(() => {
      itemListElementComponent.object = mockItemWithAuthorAndDate;
      fixture.detectChanges();
    });

    it('should show the issuedate span', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('span.item-list-date'));
      expect(itemAuthorField).not.toBeNull();
    });
  });

  describe('When the item has no issuedate', () => {
    beforeEach(() => {
      itemListElementComponent.object = mockItemWithoutAuthorAndDate;
      fixture.detectChanges();
    });

    it('should not show the issuedate span', () => {
      const dateField = fixture.debugElement.query(By.css('span.item-list-date'));
      expect(dateField).toBeNull();
    });
  });
});
