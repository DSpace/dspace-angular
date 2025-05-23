import {
  ChangeDetectionStrategy,
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { APP_CONFIG } from '../../../../../config/app-config.interface';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { Community } from '../../../../core/shared/community.model';
import { DSONameServiceMock } from '../../../mocks/dso-name.service.mock';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
import { ActivatedRouteStub } from '../../../testing/active-router.stub';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { getMockThemeService } from './../../../../shared/mocks/theme-service.mock';
import { ThemeService } from './../../../../shared/theme-support/theme.service';
import { CommunitySearchResultListElementComponent } from './community-search-result-list-element.component';

let communitySearchResultListElementComponent: CommunitySearchResultListElementComponent;
let fixture: ComponentFixture<CommunitySearchResultListElementComponent>;

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

const environmentUseThumbs = {
  browseBy: {
    showThumbnails: true,
  },
};

describe('CommunitySearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TruncatePipe, CommunitySearchResultListElementComponent],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environmentUseThumbs },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(CommunitySearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CommunitySearchResultListElementComponent);
    communitySearchResultListElementComponent = fixture.componentInstance;
    communitySearchResultListElementComponent.object = mockCommunityWithAbstract;
    fixture.detectChanges();
  }));

  describe('When the community has an abstract', () => {
    beforeEach(() => {
      communitySearchResultListElementComponent.dso = mockCommunityWithAbstract.indexableObject;
      fixture.detectChanges();
    });

    it('should show the description paragraph', () => {
      const communityAbstractField = fixture.debugElement.query(By.css('div.abstract-text'));
      expect(communityAbstractField).not.toBeNull();
    });
  });

  describe('When the community has no abstract', () => {
    beforeEach(() => {
      communitySearchResultListElementComponent.dso = mockCommunityWithoutAbstract.indexableObject;
      fixture.detectChanges();
    });

    it('should not show the description paragraph', () => {
      const communityAbstractField = fixture.debugElement.query(By.css('div.abstract-text'));
      expect(communityAbstractField).toBeNull();
    });
  });

  describe('when environment is set to show thumbnail images', () => {
    it('should offset content', () => {
      const offset: DebugElement = fixture.debugElement.query(By.css('.offset-md-2'));
      expect(offset).not.toBeNull();
    });
  });
});
