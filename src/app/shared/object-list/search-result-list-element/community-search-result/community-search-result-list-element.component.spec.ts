import { CommunitySearchResultListElementComponent } from './community-search-result-list-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { Community } from '../../../../core/shared/community.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';

let communitySearchResultListElementComponent: CommunitySearchResultListElementComponent;
let fixture: ComponentFixture<CommunitySearchResultListElementComponent>;

const truncatableServiceStub: any = {
  isCollapsed: (id: number) => Observable.of(true),
};

const mockCommunityWithAbstract: CommunitySearchResult = new CommunitySearchResult();
mockCommunityWithAbstract.hitHighlights = [];
mockCommunityWithAbstract.dspaceObject = Object.assign(new Community(), {
  metadata: [
    {
      key: 'dc.description.abstract',
      language: 'en_US',
      value: 'Short description'
    } ]
});

const mockCommunityWithoutAbstract: CommunitySearchResult = new CommunitySearchResult();
mockCommunityWithoutAbstract.hitHighlights = [];
mockCommunityWithoutAbstract.dspaceObject = Object.assign(new Community(), {
  metadata: [
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'Test title'
    } ]
});

describe('CommunitySearchResultListElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunitySearchResultListElementComponent, TruncatePipe ],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: 'objectElementProvider', useValue: (mockCommunityWithAbstract) }
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(CommunitySearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommunitySearchResultListElementComponent);
    communitySearchResultListElementComponent = fixture.componentInstance;
  }));

  describe('When the community has an abstract', () => {
    beforeEach(() => {
      communitySearchResultListElementComponent.dso = mockCommunityWithAbstract.dspaceObject;
      fixture.detectChanges();
    });

    it('should show the description paragraph', () => {
      const communityAbstractField = fixture.debugElement.query(By.css('div.abstract-text'));
      expect(communityAbstractField).not.toBeNull();
    });
  });

  describe('When the community has no abstract', () => {
    beforeEach(() => {
      communitySearchResultListElementComponent.dso = mockCommunityWithoutAbstract.dspaceObject;
      fixture.detectChanges();
    });

    it('should not show the description paragraph', () => {
      const communityAbstractField = fixture.debugElement.query(By.css('div.abstract-text'));
      expect(communityAbstractField).toBeNull();
    });
  });
});
