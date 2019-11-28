import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { OrgUnitSearchResultListSubmissionElementComponent } from './org-unit-search-result-list-submission-element.component';
import { Item } from '../../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { RelationshipService } from '../../../../../core/data/relationship.service';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { SelectableListService } from '../../../../../shared/object-list/selectable-list/selectable-list.service';
import { Store } from '@ngrx/store';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/testing/utils';
import { PaginatedList } from '../../../../../core/data/paginated-list';

let personListElementComponent: OrgUnitSearchResultListSubmissionElementComponent;
let fixture: ComponentFixture<OrgUnitSearchResultListSubmissionElementComponent>;

let mockItemWithMetadata: ItemSearchResult;
let mockItemWithoutMetadata: ItemSearchResult;

let nameVariant;
let mockRelationshipService;

function init() {
  mockItemWithMetadata = Object.assign(
    new ItemSearchResult(),
    {
      indexableObject: Object.assign(new Item(), {
        bundles: createSuccessfulRemoteDataObject$(new PaginatedList(undefined, [])),
        metadata: {
          'dc.title': [
            {
              language: 'en_US',
              value: 'This is just another title'
            }
          ],
          'organization.address.addressLocality': [
            {
              language: 'en_US',
              value: 'Europe'
            }
          ],
          'organization.address.addressCountry': [
            {
              language: 'en_US',
              value: 'Belgium'
            }
          ]
        }
      })
    });
  mockItemWithoutMetadata = Object.assign(
    new ItemSearchResult(),
    {
      indexableObject: Object.assign(new Item(), {
        bundles: createSuccessfulRemoteDataObject$(new PaginatedList(undefined, [])),
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

  nameVariant = 'Doe J.';
  mockRelationshipService = {
    getNameVariant: () => observableOf(nameVariant)
  };
}

describe('OrgUnitSearchResultListSubmissionElementComponent', () => {
  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [OrgUnitSearchResultListSubmissionElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: {} },
        { provide: RelationshipService, useValue: mockRelationshipService },
        { provide: NotificationsService, useValue: {} },
        { provide: TranslateService, useValue: {} },
        { provide: NgbModal, useValue: {} },
        { provide: ItemDataService, useValue: {} },
        { provide: SelectableListService, useValue: {} },
        { provide: Store, useValue: {} }
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(OrgUnitSearchResultListSubmissionElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrgUnitSearchResultListSubmissionElementComponent);
    personListElementComponent = fixture.componentInstance;

  }));

  describe('When the item has a address locality span', () => {
    beforeEach(() => {
      personListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the address locality span', () => {
      const jobTitleField = fixture.debugElement.query(By.css('span.item-list-address-locality'));
      expect(jobTitleField).not.toBeNull();
    });
  });

  describe('When the item has no address locality', () => {
    beforeEach(() => {
      personListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the address locality span', () => {
      const jobTitleField = fixture.debugElement.query(By.css('span.item-list-address-locality'));
      expect(jobTitleField).toBeNull();
    });
  });

  describe('When the item has a address country span', () => {
    beforeEach(() => {
      personListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the address country span', () => {
      const jobTitleField = fixture.debugElement.query(By.css('span.item-list-address-country'));
      expect(jobTitleField).not.toBeNull();
    });
  });

  describe('When the item has no address country', () => {
    beforeEach(() => {
      personListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the address country span', () => {
      const jobTitleField = fixture.debugElement.query(By.css('span.item-list-address-country'));
      expect(jobTitleField).toBeNull();
    });
  });
});
