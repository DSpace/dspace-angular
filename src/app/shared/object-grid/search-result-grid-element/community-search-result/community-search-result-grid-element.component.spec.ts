import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '@dspace/config';
import {
  AuthService,
  LinkService,
  RemoteDataBuildService,
  ObjectCacheService,
  BitstreamDataService,
  BitstreamFormatDataService,
  CommunityDataService,
  DefaultChangeAnalyzer,
  DSOChangeAnalyzer,
  NotificationsService,
  Community,
  HALEndpointService,
  CommunitySearchResult,
  UUIDService,
  ActivatedRouteStub,
  AuthServiceMock,
  StoreMock,
  XSRFService,
} from '@dspace/core'
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { getMockThemeService } from '../../../theme-support/test/theme-service.mock';
import { ThemeService } from '../../../theme-support/theme.service';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import {
  CommunitySearchResultGridElementComponent,
} from './community-search-result-grid-element.component';

let communitySearchResultGridElementComponent: CommunitySearchResultGridElementComponent;
let fixture: ComponentFixture<CommunitySearchResultGridElementComponent>;

const truncatableServiceStub: any = {
  isCollapsed: (id: number) => of(true),
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
        { provide: APP_CONFIG, useValue: { cache: { msToLive: 15 * 60 * 1000 } } },
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
