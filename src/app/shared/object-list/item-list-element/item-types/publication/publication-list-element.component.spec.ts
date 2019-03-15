import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PublicationListElementComponent } from './publication-list-element.component';
import { Item } from '../../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../utils/truncate.pipe';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { ITEM } from '../../../../items/switcher/item-type-switcher.component';
import { of as observableOf } from 'rxjs';

let publicationListElementComponent: PublicationListElementComponent;
let fixture: ComponentFixture<PublicationListElementComponent>;

const mockItemWithMetadata: Item = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald'
      }
    ],
    'dc.publisher': [
      {
        language: 'en_US',
        value: 'a publisher'
      }
    ],
    'dc.date.issued': [
      {
        language: 'en_US',
        value: '2015-06-26'
      }
    ],
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'This is the abstract'
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

describe('PublicationListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicationListElementComponent , TruncatePipe],
      providers: [
        { provide: ITEM, useValue: mockItemWithMetadata},
        { provide: TruncatableService, useValue: {} }
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(PublicationListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PublicationListElementComponent);
    publicationListElementComponent = fixture.componentInstance;

  }));

  describe('When the item has an author', () => {
    beforeEach(() => {
      publicationListElementComponent.item = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the author paragraph', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('span.item-list-authors'));
      expect(itemAuthorField).not.toBeNull();
    });
  });

  describe('When the item has no author', () => {
    beforeEach(() => {
      publicationListElementComponent.item = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the author paragraph', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('span.item-list-authors'));
      expect(itemAuthorField).toBeNull();
    });
  });

  describe('When the item has a publisher', () => {
    beforeEach(() => {
      publicationListElementComponent.item = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the publisher span', () => {
      const publisherField = fixture.debugElement.query(By.css('span.item-list-publisher'));
      expect(publisherField).not.toBeNull();
    });
  });

  describe('When the item has no publisher', () => {
    beforeEach(() => {
      publicationListElementComponent.item = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the publisher span', () => {
      const publisherField = fixture.debugElement.query(By.css('span.item-list-publisher'));
      expect(publisherField).toBeNull();
    });
  });

  describe('When the item has an issuedate', () => {
    beforeEach(() => {
      publicationListElementComponent.item = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the issuedate span', () => {
      const dateField = fixture.debugElement.query(By.css('span.item-list-date'));
      expect(dateField).not.toBeNull();
    });
  });

  describe('When the item has no issuedate', () => {
    beforeEach(() => {
      publicationListElementComponent.item = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the issuedate span', () => {
      const dateField = fixture.debugElement.query(By.css('span.item-list-date'));
      expect(dateField).toBeNull();
    });
  });

  describe('When the item has an abstract', () => {
    beforeEach(() => {
      publicationListElementComponent.item = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the abstract span', () => {
      const abstractField = fixture.debugElement.query(By.css('div.item-list-abstract'));
      expect(abstractField).not.toBeNull();
    });
  });

  describe('When the item has no abstract', () => {
    beforeEach(() => {
      publicationListElementComponent.item = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the abstract span', () => {
      const abstractField = fixture.debugElement.query(By.css('div.item-list-abstract'));
      expect(abstractField).toBeNull();
    });
  });
});
