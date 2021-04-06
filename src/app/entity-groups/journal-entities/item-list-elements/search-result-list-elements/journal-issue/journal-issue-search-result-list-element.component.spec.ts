import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { JournalIssueSearchResultListElementComponent } from './journal-issue-search-result-list-element.component';
import { Item } from '../../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../../../shared/mocks/dso-name.service.mock';

let journalIssueListElementComponent: JournalIssueSearchResultListElementComponent;
let fixture: ComponentFixture<JournalIssueSearchResultListElementComponent>;

const mockItemWithMetadata: ItemSearchResult = Object.assign(
  new ItemSearchResult(),
  {
    indexableObject: Object.assign(new Item(), {
      bundles: observableOf({}),
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
    })
  });

const mockItemWithoutMetadata: ItemSearchResult = Object.assign(
  new ItemSearchResult(),
  {
    indexableObject: Object.assign(new Item(), {
      bundles: observableOf({}),
      metadata: {
        'dc.title': [
          {
            language: 'en_US',
            value: 'This is just another title'
          }
        ]
      }
    })
  });

describe('JournalIssueSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [JournalIssueSearchResultListElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: {} },
        { provide: DSONameService, useClass: DSONameServiceMock }
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(JournalIssueSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
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
