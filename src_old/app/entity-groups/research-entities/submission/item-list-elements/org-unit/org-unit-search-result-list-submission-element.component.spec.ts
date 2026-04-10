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
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { RemoteDataBuildService } from '@dspace/core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '@dspace/core/cache/object-cache.service';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { CommunityDataService } from '@dspace/core/data/community-data.service';
import { DefaultChangeAnalyzer } from '@dspace/core/data/default-change-analyzer.service';
import { DSOChangeAnalyzer } from '@dspace/core/data/dso-change-analyzer.service';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { buildPaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { Item } from '@dspace/core/shared/item.model';
import { ItemSearchResult } from '@dspace/core/shared/object-collection/item-search-result.model';
import { UUIDService } from '@dspace/core/shared/uuid.service';
import { DSONameServiceMock } from '@dspace/core/testing/dso-name.service.mock';
import { mockTruncatableService } from '@dspace/core/testing/mock-trucatable.service';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { environment } from '../../../../../../environments/environment';
import { NameVariantService } from '../../../../../shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/name-variant.service';
import { SelectableListService } from '../../../../../shared/object-list/selectable-list/selectable-list.service';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../../shared/utils/truncate.pipe';
import { OrgUnitSearchResultListSubmissionElementComponent } from './org-unit-search-result-list-submission-element.component';

let personListElementComponent: OrgUnitSearchResultListSubmissionElementComponent;
let fixture: ComponentFixture<OrgUnitSearchResultListSubmissionElementComponent>;

let mockItemWithMetadata: ItemSearchResult;
let mockItemWithoutMetadata: ItemSearchResult;

let nameVariant;
let mockNameVariantService;

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
  mockNameVariantService = {
    getNameVariant: () => of(nameVariant),
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
        { provide: NameVariantService, useValue: mockNameVariantService },
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

