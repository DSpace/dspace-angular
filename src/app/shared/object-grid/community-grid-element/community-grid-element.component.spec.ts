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
import { TranslateModule } from '@ngx-translate/core';

import { LinkService } from '../../../core/cache/builders/link.service';
import { Community } from '../../../core/shared/community.model';
import { ThemedThumbnailComponent } from '../../../thumbnail/themed-thumbnail.component';
import { ActivatedRouteStub } from '../../testing/active-router.stub';
import { CommunityGridElementComponent } from './community-grid-element.component';

let communityGridElementComponent: CommunityGridElementComponent;
let fixture: ComponentFixture<CommunityGridElementComponent>;

const mockCommunityWithAbstract: Community = Object.assign(new Community(), {
  metadata: {
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'Short description',
      },
    ],
  },
});

const mockCommunityWithoutAbstract: Community = Object.assign(new Community(), {
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

describe('CommunityGridElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        CommunityGridElementComponent,
      ],
      providers: [
        { provide: 'objectElementProvider', useValue: (mockCommunityWithAbstract) },
        { provide: LinkService, useValue: linkService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(CommunityGridElementComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: {
        imports: [ThemedThumbnailComponent],
      },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CommunityGridElementComponent);
    communityGridElementComponent = fixture.componentInstance;
  }));

  describe('When the community has an abstract', () => {
    beforeEach(() => {
      communityGridElementComponent.object = mockCommunityWithAbstract;
      fixture.detectChanges();
    });

    it('should show the description paragraph', () => {
      const communityAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(communityAbstractField).not.toBeNull();
    });
  });

  describe('When the community has no abstract', () => {
    beforeEach(() => {
      communityGridElementComponent.object = mockCommunityWithoutAbstract;
      fixture.detectChanges();
    });

    it('should not show the description paragraph', () => {
      const communityAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(communityAbstractField).toBeNull();
    });
  });
});
