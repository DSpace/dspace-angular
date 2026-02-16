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
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { CollectionSearchResult } from '@dspace/core/shared/object-collection/collection-search-result.model';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { DSONameServiceMock } from '@dspace/core/testing/dso-name.service.mock';
import { of } from 'rxjs';

import { getMockThemeService } from '../../../theme-support/test/theme-service.mock';
import { ThemeService } from '../../../theme-support/theme.service';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { CollectionSearchResultListElementComponent } from './collection-search-result-list-element.component';

let collectionSearchResultListElementComponent: CollectionSearchResultListElementComponent;
let fixture: ComponentFixture<CollectionSearchResultListElementComponent>;

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

const environmentUseThumbs = {
  browseBy: {
    showThumbnails: true,
  },
};

describe('CollectionSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TruncatePipe, CollectionSearchResultListElementComponent],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environmentUseThumbs },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(CollectionSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CollectionSearchResultListElementComponent);
    collectionSearchResultListElementComponent = fixture.componentInstance;
    collectionSearchResultListElementComponent.object = mockCollectionWithAbstract;
    fixture.detectChanges();
  }));

  describe('When the collection has an abstract', () => {
    beforeEach(() => {
      collectionSearchResultListElementComponent.dso = mockCollectionWithAbstract.indexableObject;
      fixture.detectChanges();
    });

    it('should show the description paragraph', () => {
      const collectionAbstractField = fixture.debugElement.query(By.css('div.abstract-text'));
      expect(collectionAbstractField).not.toBeNull();
    });
  });

  describe('When the collection has no abstract', () => {
    beforeEach(() => {
      collectionSearchResultListElementComponent.dso = mockCollectionWithoutAbstract.indexableObject;
      fixture.detectChanges();
    });

    it('should not show the description paragraph', () => {
      const collectionAbstractField = fixture.debugElement.query(By.css('div.abstract-text'));
      expect(collectionAbstractField).toBeNull();
    });
  });

  describe('when environment is set to show thumbnail images', () => {
    it('should offset content', () => {
      const offset: DebugElement = fixture.debugElement.query(By.css('.offset-md-2'));
      expect(offset).not.toBeNull();
    });
  });

});
