import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { JournalIssueSearchResultListElementComponent } from './journal-issue-list-element.component';
import { of as observableOf } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { ITEM } from '../../../../shared/items/switcher/listable-object-component-loader.component';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';

let journalIssueListElementComponent: JournalIssueSearchResultListElementComponent;
let fixture: ComponentFixture<JournalIssueSearchResultListElementComponent>;

const mockItemWithMetadata: Item = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'publicationvolume.volumeNumber': [
      {
        language: 'en_US',
        value: '1234'
      }
    ],
    'publicationissue.issueNumber': [
      {
        language: 'en_US',
        value: '5678'
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

describe('JournalIssueListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalIssueSearchResultListElementComponent , TruncatePipe],
      providers: [
        { provide: ITEM, useValue: mockItemWithMetadata},
        { provide: TruncatableService, useValue: {} }
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(JournalIssueSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JournalIssueSearchResultListElementComponent);
    journalIssueListElementComponent = fixture.componentInstance;

  }));

  describe('When the item has a journal identifier', () => {
    beforeEach(() => {
      journalIssueListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the journal issues span', () => {
      const journalIdentifierField = fixture.debugElement.query(By.css('span.item-list-journal-issues'));
      expect(journalIdentifierField).not.toBeNull();
    });
  });

  describe('When the item has no journal identifier', () => {
    beforeEach(() => {
      journalIssueListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the journal issues span', () => {
      const journalIdentifierField = fixture.debugElement.query(By.css('span.item-list-journal-issues'));
      expect(journalIdentifierField).toBeNull();
    });
  });

  describe('When the item has a journal number', () => {
    beforeEach(() => {
      journalIssueListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the journal issue numbers span', () => {
      const journalNumberField = fixture.debugElement.query(By.css('span.item-list-journal-issue-numbers'));
      expect(journalNumberField).not.toBeNull();
    });
  });

  describe('When the item has no journal number', () => {
    beforeEach(() => {
      journalIssueListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the journal issue numbers span', () => {
      const journalNumberField = fixture.debugElement.query(By.css('span.item-list-journal-issue-numbers'));
      expect(journalNumberField).toBeNull();
    });
  });
});
