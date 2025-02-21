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
import { Store } from '@ngrx/store';
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
import { CommunitySearchResult } from '../../../../../../modules/core/src/lib/core/object-collection/community-search-result.model';
import { Community } from '../../../../../../modules/core/src/lib/core/shared/community.model';
import { HALEndpointService } from '../../../../../../modules/core/src/lib/core/shared/hal-endpoint.service';
import { UUIDService } from '../../../../../../modules/core/src/lib/core/shared/uuid.service';
import { ActivatedRouteStub } from '../../../../../../modules/core/src/lib/core/utilities/testing/active-router.stub';
import { StoreMock } from '../../../../../../modules/core/src/lib/core/utilities/testing/store.mock';
import { XSRFService } from '../../../../../../modules/core/src/lib/core/xsrf/xsrf.service';
import { AuthServiceMock } from '../../../mocks/auth.service.mock';
import { getMockThemeService } from '../../../mocks/theme-service.mock';
import { ThemeService } from '../../../theme-support/theme.service';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { CommunitySearchResultGridElementComponent } from './community-search-result-grid-element.component';

let communitySearchResultGridElementComponent: CommunitySearchResultGridElementComponent;
let fixture: ComponentFixture<CommunitySearchResultGridElementComponent>;

const truncatableServiceStub: any = {
  isCollapsed: (id: number) => observableOf(true),
};

const mockCommunityWithAbstract: CommunitySearchResult = new CommunitySearchResult();
mockCommunityWithAbstract.hitHighlights = {};
mockCommunityWithAbstract.indexableObject = Object.assign(new Community(), {
  metadata: {
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'Short description',
      },
    ],
  },
});

const mockCommunityWithoutAbstract: CommunitySearchResult = new CommunitySearchResult();
mockCommunityWithoutAbstract.hitHighlights = {};
mockCommunityWithoutAbstract.indexableObject = Object.assign(new Community(), {
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
  resolveLink: mockCommunityWithAbstract,
});

describe('CommunitySearchResultGridElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        TruncatePipe,
        CommunitySearchResultGridElementComponent,
      ],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: 'objectElementProvider', useValue: (mockCommunityWithAbstract) },
        { provide: ObjectCacheService, useValue: {} },
        { provide: UUIDService, useValue: {} },
        { provide: Store, useValue: StoreMock },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: BitstreamDataService, useValue: {} },
        { provide: CommunityDataService, useValue: {} },
        { provide: HALEndpointService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: DSOChangeAnalyzer, useValue: {} },
        { provide: DefaultChangeAnalyzer, useValue: {} },
        { provide: BitstreamFormatDataService, useValue: {} },
        { provide: LinkService, useValue: linkService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: XSRFService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(CommunitySearchResultGridElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CommunitySearchResultGridElementComponent);
    communitySearchResultGridElementComponent = fixture.componentInstance;
  }));

  describe('When the community has an abstract', () => {
    beforeEach(() => {
      communitySearchResultGridElementComponent.dso = mockCommunityWithAbstract.indexableObject;
      fixture.detectChanges();
    });

    it('should show the description paragraph', () => {
      const communityAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(communityAbstractField).not.toBeNull();
    });
  });

  describe('When the community has no abstract', () => {
    beforeEach(() => {
      communitySearchResultGridElementComponent.dso = mockCommunityWithoutAbstract.indexableObject;
      fixture.detectChanges();
    });

    it('should not show the description paragraph', () => {
      const communityAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(communityAbstractField).toBeNull();
    });
  });
});
