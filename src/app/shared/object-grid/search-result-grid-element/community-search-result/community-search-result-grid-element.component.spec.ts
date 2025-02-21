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

import { AuthService } from '@dspace/core';
import { LinkService } from '@dspace/core';
import { RemoteDataBuildService } from '@dspace/core';
import { ObjectCacheService } from '@dspace/core';
import { BitstreamDataService } from '@dspace/core';
import { BitstreamFormatDataService } from '@dspace/core';
import { CommunityDataService } from '@dspace/core';
import { DefaultChangeAnalyzer } from '@dspace/core';
import { DSOChangeAnalyzer } from '@dspace/core';
import { NotificationsService } from '@dspace/core';
import { CommunitySearchResult } from '@dspace/core';
import { Community } from '@dspace/core';
import { HALEndpointService } from '@dspace/core';
import { UUIDService } from '@dspace/core';
import { ActivatedRouteStub } from '@dspace/core';
import { StoreMock } from '@dspace/core';
import { XSRFService } from '@dspace/core';
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
