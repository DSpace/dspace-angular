import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Item } from '../../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../utils/truncate.pipe';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { ITEM } from '../../../../items/switcher/item-type-switcher.component';
import { OrgUnitListElementComponent } from './orgunit-list-element.component';
import { of as observableOf } from 'rxjs';

let orgUnitListElementComponent: OrgUnitListElementComponent;
let fixture: ComponentFixture<OrgUnitListElementComponent>;

const mockItemWithMetadata: Item = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'orgunit.identifier.description': [
      {
        language: 'en_US',
        value: 'A description about the OrgUnit'
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

describe('OrgUnitListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgUnitListElementComponent , TruncatePipe],
      providers: [
        { provide: ITEM, useValue: mockItemWithMetadata},
        { provide: TruncatableService, useValue: {} }
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(OrgUnitListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrgUnitListElementComponent);
    orgUnitListElementComponent = fixture.componentInstance;

  }));

  describe('When the item has an orgunit description', () => {
    beforeEach(() => {
      orgUnitListElementComponent.item = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the description span', () => {
      const orgunitDescriptionField = fixture.debugElement.query(By.css('span.item-list-orgunit-description'));
      expect(orgunitDescriptionField).not.toBeNull();
    });
  });

  describe('When the item has no orgunit description', () => {
    beforeEach(() => {
      orgUnitListElementComponent.item = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the description span', () => {
      const orgunitDescriptionField = fixture.debugElement.query(By.css('span.item-list-orgunit-description'));
      expect(orgunitDescriptionField).toBeNull();
    });
  });
});
