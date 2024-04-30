import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
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

import { APP_CONFIG } from '../../../../../../config/app-config.interface';
import { REQUEST } from '../../../../../../express.tokens';
import { AuthService } from '../../../../../core/auth/auth.service';
import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../../../core/cache/object-cache.service';
import { CommunityDataService } from '../../../../../core/data/community-data.service';
import { DefaultChangeAnalyzer } from '../../../../../core/data/default-change-analyzer.service';
import { DSOChangeAnalyzer } from '../../../../../core/data/dso-change-analyzer.service';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { buildPaginatedList } from '../../../../../core/data/paginated-list.model';
import { RelationshipDataService } from '../../../../../core/data/relationship-data.service';
import { RemoteData } from '../../../../../core/data/remote-data';
import { Bitstream } from '../../../../../core/shared/bitstream.model';
import { HALEndpointService } from '../../../../../core/shared/hal-endpoint.service';
import { Item } from '../../../../../core/shared/item.model';
import { UUIDService } from '../../../../../core/shared/uuid.service';
import { XSRFService } from '../../../../../core/xsrf/xsrf.service';
import { getMockThemeService } from '../../../../../shared/mocks/theme-service.mock';
import { CollectionElementLinkType } from '../../../../../shared/object-collection/collection-element-link.type';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { SelectableListService } from '../../../../../shared/object-list/selectable-list/selectable-list.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';
import { ThemeService } from '../../../../../shared/theme-support/theme.service';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../../shared/utils/truncate.pipe';
import { PersonSearchResultListSubmissionElementComponent } from './person-search-result-list-submission-element.component';

let personListElementComponent: PersonSearchResultListSubmissionElementComponent;
let fixture: ComponentFixture<PersonSearchResultListSubmissionElementComponent>;

let mockItemWithMetadata: ItemSearchResult;
let mockItemWithoutMetadata: ItemSearchResult;

let nameVariant;
let mockRelationshipService;

const environmentUseThumbs = {
  browseBy: {
    showThumbnails: true,
  },
};

const enviromentNoThumbs = {
  browseBy: {
    showThumbnails: false,
  },
};

const translateServiceStub = {
  get: () => observableOf('test' ),
  instant: (key) => key,
  onLangChange: new EventEmitter(),
  onTranslationChange: new EventEmitter(),
  onDefaultLangChange: new EventEmitter(),
};

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
          'person.jobTitle': [
            {
              language: 'en_US',
              value: 'Developer',
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

describe('PersonSearchResultListElementSubmissionComponent', () => {
  const mockBitstreamDataService = {
    getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
      return createSuccessfulRemoteDataObject$(new Bitstream());
    },
  };
  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [TruncatePipe, PersonSearchResultListSubmissionElementComponent],
      providers: [
        { provide: TruncatableService, useValue: {} },
        { provide: RelationshipDataService, useValue: mockRelationshipService },
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: NgbModal, useValue: {} },
        { provide: ItemDataService, useValue: {} },
        { provide: SelectableListService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: ObjectCacheService, useValue: {} },
        { provide: UUIDService, useValue: {} },
        { provide: XSRFService, useValue: {} },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: CommunityDataService, useValue: {} },
        { provide: HALEndpointService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: DSOChangeAnalyzer, useValue: {} },
        { provide: DefaultChangeAnalyzer, useValue: {} },
        { provide: APP_CONFIG, useValue: environmentUseThumbs },
        { provide: AuthService, useValue: {} },
        { provide: REQUEST, useValue: {} },
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(PersonSearchResultListSubmissionElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PersonSearchResultListSubmissionElementComponent);
    personListElementComponent = fixture.componentInstance;

  }));

  describe('When the item has a job title', () => {
    beforeEach(() => {
      personListElementComponent.object = mockItemWithMetadata;
      personListElementComponent.dso = Object.assign(
        new Item(),
        {

          metadata: {
            'dc.title': [
              {
                language: 'en_US',
                value: 'This is just another title',
              },
            ],
            'person.jobTitle': [
              {
                language: 'en_US',
                value: 'Developer',
              },
            ],
          },
        });
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

  describe('When the environment is set to show thumbnails', () => {
    beforeEach(() => {
      personListElementComponent.object = mockItemWithoutMetadata;
      personListElementComponent.linkType = CollectionElementLinkType.ExternalLink;
      fixture.detectChanges();
    });

    it('should add the thumbnail element', () => {
      const thumbnail = fixture.debugElement.query(By.css('ds-thumbnail'));
      expect(thumbnail).toBeTruthy();
    });
  });
});

describe('PersonSearchResultListElementSubmissionComponent', () => {
  const mockBitstreamDataService = {
    getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
      return createSuccessfulRemoteDataObject$(new Bitstream());
    },
  };
  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [TruncatePipe, PersonSearchResultListSubmissionElementComponent],
      providers: [
        { provide: TruncatableService, useValue: {} },
        { provide: RelationshipDataService, useValue: mockRelationshipService },
        { provide: TranslateService, useValue: translateServiceStub },
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
        { provide: APP_CONFIG, useValue: enviromentNoThumbs },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(PersonSearchResultListSubmissionElementComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PersonSearchResultListSubmissionElementComponent);
    personListElementComponent = fixture.componentInstance;

  }));

  describe('When the environment is not set to show thumbnails', () => {
    beforeEach(() => {
      personListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not add the thumbnail element', () => {
      const thumbnail = fixture.debugElement.query(By.css('ds-thumbnail'));
      expect(thumbnail).toBeNull();
    });
  });
});

@Component({
  selector: 'ds-mock-thumbnail',
  template: '<div></div>',
  standalone: true,
})
export class ThumbnailStubComponent {

}
