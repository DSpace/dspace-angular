import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../utils/truncate.pipe';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { ITEM } from '../../../../entities/switcher/entity-type-switcher.component';
import { JournalVolumeListElementComponent } from './journal-volume-list-element.component';

let journalVolumeListElementComponent: JournalVolumeListElementComponent;
let fixture: ComponentFixture<JournalVolumeListElementComponent>;

const mockItemWithMetadata: Item = Object.assign(new Item(), {
  bitstreams: Observable.of({}),
  metadata: [
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'This is just another title'
    },
    {
      key: 'journal.title',
      language: 'en_US',
      value: 'This is just another journal title'
    },
    {
      key: 'journalvolume.identifier.volume',
      language: 'en_US',
      value: '1234'
    }]
});
const mockItemWithoutMetadata: Item = Object.assign(new Item(), {
  bitstreams: Observable.of({}),
  metadata: [
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'This is just another title'
    }]
});

describe('JournalVolumeListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalVolumeListElementComponent , TruncatePipe],
      providers: [
        { provide: ITEM, useValue: mockItemWithMetadata},
        { provide: TruncatableService, useValue: {} }
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(JournalVolumeListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JournalVolumeListElementComponent);
    journalVolumeListElementComponent = fixture.componentInstance;

  }));

  describe('When the item has a journal title', () => {
    beforeEach(() => {
      journalVolumeListElementComponent.item = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the journal title span', () => {
      const journalTitleField = fixture.debugElement.query(By.css('span.item-list-journal-volumes'));
      expect(journalTitleField).not.toBeNull();
    });
  });

  describe('When the item has no journal title', () => {
    beforeEach(() => {
      journalVolumeListElementComponent.item = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the journal title span', () => {
      const journalTitleField = fixture.debugElement.query(By.css('span.item-list-journal-volumes'));
      expect(journalTitleField).toBeNull();
    });
  });

  describe('When the item has a journal identifier', () => {
    beforeEach(() => {
      journalVolumeListElementComponent.item = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the journal identifiers span', () => {
      const journalIdentifierField = fixture.debugElement.query(By.css('span.item-list-journal-volume-identifiers'));
      expect(journalIdentifierField).not.toBeNull();
    });
  });

  describe('When the item has no journal identifier', () => {
    beforeEach(() => {
      journalVolumeListElementComponent.item = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the journal identifiers span', () => {
      const journalIdentifierField = fixture.debugElement.query(By.css('span.item-list-journal-volume-identifiers'));
      expect(journalIdentifierField).toBeNull();
    });
  });
});
