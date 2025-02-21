import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { environment } from '../../../../../../environments/environment';
import { DSONameService } from '@dspace/core';
import { RemoteDataBuildService } from '@dspace/core';
import { ObjectCacheService } from '@dspace/core';
import { APP_CONFIG } from '@dspace/core';
import { BitstreamDataService } from '@dspace/core';
import { CommunityDataService } from '@dspace/core';
import { DefaultChangeAnalyzer } from '@dspace/core';
import { DSOChangeAnalyzer } from '@dspace/core';
import { ItemDataService } from '@dspace/core';
import { buildPaginatedList } from '@dspace/core';
import { RelationshipDataService } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { NotificationsService } from '@dspace/core';
import { ItemSearchResult } from '@dspace/core';
import { Bitstream } from '@dspace/core';
import { HALEndpointService } from '@dspace/core';
import { Item } from '@dspace/core';
import { UUIDService } from '@dspace/core';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core';
import { DSONameServiceMock } from '../../../../../shared/mocks/dso-name.service.mock';
import { mockTruncatableService } from '../../../../../shared/mocks/mock-trucatable.service';
import { SelectableListService } from '@dspace/core';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../../shared/utils/truncate.pipe';
import { OrgUnitSearchResultListSubmissionElementComponent } from './org-unit-search-result-list-submission-element.component';

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
        bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(undefined, [])),
        metadata: {
          'dc.title': [
            {
              language: 'en_US',
              value: 'This is just another title',
            },
          ],
          'organization.address.addressLocality': [
            {
              language: 'en_US',
              value: 'Europe',
            },
          ],
          'organization.address.addressCountry': [
            {
              language: 'en_US',
              value: 'Belgium',
            },
          ],
        },
      }),
    });
  mockItemWithoutMetadata = Object.assign(
    new ItemSearchResult(),
    {
      indexableObject: Object.assign(new Item(), {
        bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(undefined, [])),
        metadata: {
          'dc.title': [
            {
              language: 'en_US',
              value: 'This is just another title',
            },
          ],
        },
      }),
    });

  nameVariant = 'Doe J.';
  mockRelationshipService = {
    getNameVariant: () => observableOf(nameVariant),
  };
}

describe('OrgUnitSearchResultListSubmissionElementComponent', () => {
  beforeEach(waitForAsync(() => {
    init();
    const mockBitstreamDataService = {
      getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
        return createSuccessfulRemoteDataObject$(new Bitstream());
      },
    };
    TestBed.configureTestingModule({
      imports: [TruncatePipe, OrgUnitSearchResultListSubmissionElementComponent],
      providers: [
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: RelationshipDataService, useValue: mockRelationshipService },
        { provide: NotificationsService, useValue: {} },
        { provide: TranslateService, useValue: {} },
        { provide: NgbModal, useValue: {} },
        { provide: ItemDataService, useValue: {} },
        { provide: SelectableListService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: ObjectCacheService, useValue: {} },
        { provide: UUIDService, useValue: {} },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: CommunityDataService, useValue: {} },
        { provide: HALEndpointService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: DSOChangeAnalyzer, useValue: {} },
        { provide: DefaultChangeAnalyzer, useValue: {} },
        { provide: BitstreamDataService, useValue: mockBitstreamDataService },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environment },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(OrgUnitSearchResultListSubmissionElementComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
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

