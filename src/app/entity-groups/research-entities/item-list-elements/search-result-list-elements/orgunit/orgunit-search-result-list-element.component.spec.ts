import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';
import { OrgunitSearchResultListElementComponent } from './orgunit-search-result-list-element.component';
import { Item } from '../../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';

let orgUnitListElementComponent: OrgunitSearchResultListElementComponent;
let fixture: ComponentFixture<OrgunitSearchResultListElementComponent>;

const mockItemWithMetadata: ItemSearchResult = Object.assign(
  new ItemSearchResult(),
  {
    indexableObject: Object.assign(new Item(), {
      bitstreams: observableOf({}),
      metadata: {
        'dc.title': [
          {
            language: 'en_US',
            value: 'This is just another title'
          }
        ],
        'dc.description': [
          {
            language: 'en_US',
            value: 'A description about the OrgUnit'
          }
        ]
      }
    })
  });
const mockItemWithoutMetadata: ItemSearchResult = Object.assign(
  new ItemSearchResult(),
  {
    indexableObject: Object.assign(new Item(), {
      bitstreams: observableOf({}),
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

describe('OrgUnitSearchResultListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgunitSearchResultListElementComponent , TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: {} }
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(OrgunitSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrgunitSearchResultListElementComponent);
    orgUnitListElementComponent = fixture.componentInstance;

  }));

  describe('When the item has an orgunit description', () => {
    beforeEach(() => {
      orgUnitListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the description span', () => {
      const orgunitDescriptionField = fixture.debugElement.query(By.css('span.item-list-orgunit-description'));
      expect(orgunitDescriptionField).not.toBeNull();
    });
  });

  describe('When the item has no orgunit description', () => {
    beforeEach(() => {
      orgUnitListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the description span', () => {
      const orgunitDescriptionField = fixture.debugElement.query(By.css('span.item-list-orgunit-description'));
      expect(orgunitDescriptionField).toBeNull();
    });
  });
});
