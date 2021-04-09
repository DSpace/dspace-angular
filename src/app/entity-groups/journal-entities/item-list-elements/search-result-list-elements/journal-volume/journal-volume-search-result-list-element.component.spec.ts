import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { Item } from '../../../../../core/shared/item.model';
import { JournalVolumeSearchResultListElementComponent } from './journal-volume-search-result-list-element.component';
import { TruncatePipe } from '../../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../../../shared/mocks/dso-name.service.mock';

let journalVolumeListElementComponent: JournalVolumeSearchResultListElementComponent;
let fixture: ComponentFixture<JournalVolumeSearchResultListElementComponent>;

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
        'journal.title': [
          {
            language: 'en_US',
            value: 'This is just another journal title'
          }
        ],
        'publicationvolume.volumeNumber': [
          {
            language: 'en_US',
            value: '1234'
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

describe('JournalVolumeSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [JournalVolumeSearchResultListElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: {} },
        { provide: DSONameService, useClass: DSONameServiceMock },
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(JournalVolumeSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(JournalVolumeSearchResultListElementComponent);
    journalVolumeListElementComponent = fixture.componentInstance;

  }));

  describe('When the item has a journal title', () => {
    beforeEach(() => {
      journalVolumeListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the journal title span', () => {
      const journalTitleField = fixture.debugElement.query(By.css('span.item-list-journal-volumes'));
      expect(journalTitleField).not.toBeNull();
    });
  });

  describe('When the item has no journal title', () => {
    beforeEach(() => {
      journalVolumeListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the journal title span', () => {
      const journalTitleField = fixture.debugElement.query(By.css('span.item-list-journal-volumes'));
      expect(journalTitleField).toBeNull();
    });
  });

  describe('When the item has a journal identifier', () => {
    beforeEach(() => {
      journalVolumeListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the journal identifiers span', () => {
      const journalIdentifierField = fixture.debugElement.query(By.css('span.item-list-journal-volume-identifiers'));
      expect(journalIdentifierField).not.toBeNull();
    });
  });

  describe('When the item has no journal identifier', () => {
    beforeEach(() => {
      journalVolumeListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the journal identifiers span', () => {
      const journalIdentifierField = fixture.debugElement.query(By.css('span.item-list-journal-volume-identifiers'));
      expect(journalIdentifierField).toBeNull();
    });
  });
});
