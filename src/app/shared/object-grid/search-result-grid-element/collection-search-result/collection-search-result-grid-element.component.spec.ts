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
import { ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { AuthService } from '@dspace/core/auth/auth.service';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { RemoteDataBuildService } from '@dspace/core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '@dspace/core/cache/object-cache.service';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { BitstreamFormatDataService } from '@dspace/core/data/bitstream-format-data.service';
import { CommunityDataService } from '@dspace/core/data/community-data.service';
import { DefaultChangeAnalyzer } from '@dspace/core/data/default-change-analyzer.service';
import { DSOChangeAnalyzer } from '@dspace/core/data/dso-change-analyzer.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { CollectionSearchResult } from '@dspace/core/shared/object-collection/collection-search-result.model';
import { UUIDService } from '@dspace/core/shared/uuid.service';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { AuthServiceStub } from '@dspace/core/testing/auth-service.stub';
import { XSRFService } from '@dspace/core/xsrf/xsrf.service';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { TruncatableService } from '../../../truncatable/truncatable.service';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { CollectionSearchResultGridElementComponent } from './collection-search-result-grid-element.component';

let collectionSearchResultGridElementComponent: CollectionSearchResultGridElementComponent;
let fixture: ComponentFixture<CollectionSearchResultGridElementComponent>;

const truncatableServiceStub: any = {
  isCollapsed: (id: number) => of(true),
};

const mockCollectionWithAbstract: CollectionSearchResult = new CollectionSearchResult();
mockCollectionWithAbstract.hitHighlights = {};
mockCollectionWithAbstract.indexableObject = Object.assign(new Collection(), {
  metadata: {
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'Short description',
      },
    ],
  },
});

const mockCollectionWithoutAbstract: CollectionSearchResult = new CollectionSearchResult();
mockCollectionWithoutAbstract.hitHighlights = {};
mockCollectionWithoutAbstract.indexableObject = Object.assign(new Collection(), {
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'Test title',
      },
    ],
  },
});
const linkService = jasmine.createSpyObj('linkService', {
  resolveLink: mockCollectionWithAbstract,
});

describe('CollectionSearchResultGridElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        TruncatePipe,
        CollectionSearchResultGridElementComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: 'objectElementProvider', useValue: (mockCollectionWithAbstract) },
        { provide: ObjectCacheService, useValue: {} },
        { provide: UUIDService, useValue: {} },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: AuthService, useValue: new AuthServiceStub() },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: BitstreamDataService, useValue: {} },
        { provide: CommunityDataService, useValue: {} },
        { provide: HALEndpointService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: DSOChangeAnalyzer, useValue: {} },
        { provide: DefaultChangeAnalyzer, useValue: {} },
        { provide: BitstreamFormatDataService, useValue: {} },
        { provide: XSRFService, useValue: {} },
        { provide: LinkService, useValue: linkService },
        { provide: APP_CONFIG, useValue: { cache: { msToLive: 15 * 60 * 1000  } } },
        provideMockStore({}),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(CollectionSearchResultGridElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CollectionSearchResultGridElementComponent);
    collectionSearchResultGridElementComponent = fixture.componentInstance;
  }));

  describe('When the collection has an abstract', () => {
    beforeEach(() => {
      collectionSearchResultGridElementComponent.dso = mockCollectionWithAbstract.indexableObject;
      fixture.detectChanges();
    });

    it('should show the description paragraph', () => {
      const collectionAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(collectionAbstractField).not.toBeNull();
    });
  });

  describe('When the collection has no abstract', () => {
    beforeEach(() => {
      collectionSearchResultGridElementComponent.dso = mockCollectionWithoutAbstract.indexableObject;
      fixture.detectChanges();
    });

    it('should not show the description paragraph', () => {
      const collectionAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(collectionAbstractField).toBeNull();
    });
  });
});
