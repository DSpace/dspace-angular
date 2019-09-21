import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PersonListElementComponent } from './person-list-element.component';
import { of as observableOf } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';

let personListElementComponent: PersonListElementComponent;
let fixture: ComponentFixture<PersonListElementComponent>;

const mockItemWithMetadata: Item = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'person.jobTitle': [
      {
        language: 'en_US',
        value: 'Developer'
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

describe('PersonListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonListElementComponent , TruncatePipe],
      providers: [
        { provide: ITEM, useValue: mockItemWithMetadata},
        { provide: TruncatableService, useValue: {} }
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(PersonListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PersonListElementComponent);
    personListElementComponent = fixture.componentInstance;

  }));

  describe('When the item has a job title', () => {
    beforeEach(() => {
      personListElementComponent.item = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the job title span', () => {
      const jobTitleField = fixture.debugElement.query(By.css('span.item-list-job-title'));
      expect(jobTitleField).not.toBeNull();
    });
  });

  describe('When the item has no job title', () => {
    beforeEach(() => {
      personListElementComponent.item = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the job title span', () => {
      const jobTitleField = fixture.debugElement.query(By.css('span.item-list-job-title'));
      expect(jobTitleField).toBeNull();
    });
  });
});
