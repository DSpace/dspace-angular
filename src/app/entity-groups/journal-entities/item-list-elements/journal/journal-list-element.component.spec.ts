import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { JournalListElementComponent } from './journal-list-element.component';
import { of as observableOf } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';

let journalListElementComponent: JournalListElementComponent;
let fixture: ComponentFixture<JournalListElementComponent>;

const mockItemWithMetadata: Item = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'creativeworkseries.issn': [
      {
        language: 'en_US',
        value: '1234'
      }
    ]
  }
});
const mockItemWithoutMetadata: Item = Object.assign(new Item(), {
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

describe('JournalListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalListElementComponent , TruncatePipe],
      providers: [
        { provide: ITEM, useValue: mockItemWithMetadata},
        { provide: TruncatableService, useValue: {} }
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(JournalListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JournalListElementComponent);
    journalListElementComponent = fixture.componentInstance;

  }));

  describe('When the item has an issn', () => {
    beforeEach(() => {
      journalListElementComponent.item = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the journals span', () => {
      const issnField = fixture.debugElement.query(By.css('span.item-list-journals'));
      expect(issnField).not.toBeNull();
    });
  });

  describe('When the item has no issn', () => {
    beforeEach(() => {
      journalListElementComponent.item = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the journals span', () => {
      const issnField = fixture.debugElement.query(By.css('span.item-list-journals'));
      expect(issnField).toBeNull();
    });
  });
});
