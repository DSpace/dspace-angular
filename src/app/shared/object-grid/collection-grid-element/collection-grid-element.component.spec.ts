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

import { AuthService } from '../../../core/auth/auth.service';
import { LinkService } from '../../../core/cache/builders/link.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { Collection } from '../../../core/shared/collection.model';
import { AuthServiceMock } from '../../mocks/auth.service.mock';
import { getMockThemeService } from '../../mocks/theme-service.mock';
import { ActivatedRouteStub } from '../../testing/active-router.stub';
import { ThemeService } from '../../theme-support/theme.service';
import { CollectionGridElementComponent } from './collection-grid-element.component';

let collectionGridElementComponent: CollectionGridElementComponent;
let fixture: ComponentFixture<CollectionGridElementComponent>;

const mockCollectionWithAbstract: Collection = Object.assign(new Collection(), {
  metadata: {
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'Short description',
      },
    ],
  },
});

const mockCollectionWithoutAbstract: Collection = Object.assign(new Collection(), {
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

describe('CollectionGridElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        CollectionGridElementComponent,
      ],
      providers: [
        { provide: 'objectElementProvider', useValue: (mockCollectionWithAbstract) },
        { provide: LinkService, useValue: linkService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: AuthorizationDataService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(CollectionGridElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CollectionGridElementComponent);
    collectionGridElementComponent = fixture.componentInstance;
  }));

  describe('When the collection has an abstract', () => {
    beforeEach(() => {
      collectionGridElementComponent.object = mockCollectionWithAbstract;
      fixture.detectChanges();
    });

    it('should show the description paragraph', () => {
      const collectionAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(collectionAbstractField).not.toBeNull();
    });
  });

  describe('When the collection has no abstract', () => {
    beforeEach(() => {
      collectionGridElementComponent.object = mockCollectionWithoutAbstract;
      fixture.detectChanges();
    });

    it('should not show the description paragraph', () => {
      const collectionAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(collectionAbstractField).toBeNull();
    });
  });
});
