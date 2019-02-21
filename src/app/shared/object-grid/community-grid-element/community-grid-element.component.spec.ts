import { CommunityGridElementComponent } from './community-grid-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Community } from '../../../core/shared/community.model';

let communityGridElementComponent: CommunityGridElementComponent;
let fixture: ComponentFixture<CommunityGridElementComponent>;

const mockCommunityWithAbstract: Community = Object.assign(new Community(), {
  metadata: {
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'Short description'
      }
    ]
  }
});

const mockCommunityWithoutAbstract: Community = Object.assign(new Community(), {
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'Test title'
      }
    ]
  }
});

describe('CommunityGridElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityGridElementComponent ],
      providers: [
        { provide: 'objectElementProvider', useValue: (mockCommunityWithAbstract)}
      ],

    schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(CommunityGridElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
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
