import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PersonSearchResultListElementComponent } from './person-list-element.component';
import { of as observableOf } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';

let personListElementComponent: PersonSearchResultListElementComponent;
let fixture: ComponentFixture<PersonSearchResultListElementComponent>;

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
      declarations: [ PersonSearchResultListElementComponent , TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: {} }
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(PersonSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PersonSearchResultListElementComponent);
    personListElementComponent = fixture.componentInstance;

  }));

  describe('When the item has a job title', () => {
    beforeEach(() => {
      personListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the job title span', () => {
      const jobTitleField = fixture.debugElement.query(By.css('span.item-list-job-title'));
      expect(jobTitleField).not.toBeNull();
    });
  });

  describe('When the item has no job title', () => {
    beforeEach(() => {
      personListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the job title span', () => {
      const jobTitleField = fixture.debugElement.query(By.css('span.item-list-job-title'));
      expect(jobTitleField).toBeNull();
    });
  });
});
