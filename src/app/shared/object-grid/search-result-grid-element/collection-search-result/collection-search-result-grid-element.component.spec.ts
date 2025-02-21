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
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { AuthService } from '../../../../../../modules/core/src/lib/core/auth/auth.service';
import { LinkService } from '../../../../../../modules/core/src/lib/core/cache/builders/link.service';
import { RemoteDataBuildService } from '../../../../../../modules/core/src/lib/core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../../../../modules/core/src/lib/core/cache/object-cache.service';
import { BitstreamDataService } from '../../../../../../modules/core/src/lib/core/data/bitstream-data.service';
import { BitstreamFormatDataService } from '../../../../../../modules/core/src/lib/core/data/bitstream-format-data.service';
import { CommunityDataService } from '../../../../../../modules/core/src/lib/core/data/community-data.service';
import { DefaultChangeAnalyzer } from '../../../../../../modules/core/src/lib/core/data/default-change-analyzer.service';
import { DSOChangeAnalyzer } from '../../../../../../modules/core/src/lib/core/data/dso-change-analyzer.service';
import { NotificationsService } from '../../../../../../modules/core/src/lib/core/notifications/notifications.service';
import { CollectionSearchResult } from '../../../../../../modules/core/src/lib/core/object-collection/collection-search-result.model';
import { Collection } from '../../../../../../modules/core/src/lib/core/shared/collection.model';
import { HALEndpointService } from '../../../../../../modules/core/src/lib/core/shared/hal-endpoint.service';
import { UUIDService } from '../../../../../../modules/core/src/lib/core/shared/uuid.service';
import { ActivatedRouteStub } from '../../../../../../modules/core/src/lib/core/utilities/testing/active-router.stub';
import { AuthServiceStub } from '../../../../../../modules/core/src/lib/core/utilities/testing/auth-service.stub';
import { XSRFService } from '../../../../../../modules/core/src/lib/core/xsrf/xsrf.service';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { CollectionSearchResultGridElementComponent } from './collection-search-result-grid-element.component';

let collectionSearchResultGridElementComponent: CollectionSearchResultGridElementComponent;
let fixture: ComponentFixture<CollectionSearchResultGridElementComponent>;

const truncatableServiceStub: any = {
  isCollapsed: (id: number) => observableOf(true),
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
