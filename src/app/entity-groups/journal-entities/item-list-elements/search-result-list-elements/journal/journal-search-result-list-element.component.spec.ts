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
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { Item } from '@dspace/core/shared/item.model';
import { ItemSearchResult } from '@dspace/core/shared/object-collection/item-search-result.model';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { DSONameServiceMock } from '@dspace/core/testing/dso-name.service.mock';
import { mockTruncatableService } from '@dspace/core/testing/mock-trucatable.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ThemeService } from 'src/app/shared/theme-support/theme.service';

import { ThemedBadgesComponent } from '../../../../../shared/object-collection/shared/badges/themed-badges.component';
import { getMockThemeService } from '../../../../../shared/theme-support/test/theme-service.mock';
import { TruncatableComponent } from '../../../../../shared/truncatable/truncatable.component';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { TruncatablePartComponent } from '../../../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { TruncatePipe } from '../../../../../shared/utils/truncate.pipe';
import { ThemedThumbnailComponent } from '../../../../../thumbnail/themed-thumbnail.component';
import { JournalSearchResultListElementComponent } from './journal-search-result-list-element.component';

let journalListElementComponent: JournalSearchResultListElementComponent;
let fixture: ComponentFixture<JournalSearchResultListElementComponent>;

const mockItemWithMetadata: ItemSearchResult = Object.assign(
  new ItemSearchResult(),
  {
    indexableObject: Object.assign(new Item(), {
      bundles: of({}),
      metadata: {
        'dc.title': [
          {
            language: 'en_US',
            value: 'This is just another title',
          },
        ],
        'creativeworkseries.issn': [
          {
            language: 'en_US',
            value: '1234',
          },
        ],
      },
    }),
  });

const mockItemWithoutMetadata: ItemSearchResult = Object.assign(
  new ItemSearchResult(),
  {
    indexableObject: Object.assign(new Item(), {
      bundles: of({}),
      metadata: {
        'dc.title': [
          {
            language: 'en_US',
            value: 'This is just another title',
          },
        ],
      },
    }),
  },
);

const environmentUseThumbs = {
  browseBy: {
    showThumbnails: true,
  },
};

const enviromentNoThumbs = {
  browseBy: {
    showThumbnails: false,
  },
};

describe('JournalSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TruncatePipe, TranslateModule.forRoot(), JournalSearchResultListElementComponent],
      providers: [
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environmentUseThumbs },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(JournalSearchResultListElementComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: {
        imports: [
          ThemedThumbnailComponent,
          ThemedBadgesComponent,
          TruncatableComponent,
          TruncatablePartComponent,
        ],
      },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(JournalSearchResultListElementComponent);
    journalListElementComponent = fixture.componentInstance;

  }));

  describe('with environment.browseBy.showThumbnails set to true', () => {
    beforeEach(() => {
      journalListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });
    it('should set showThumbnails to true', () => {
      expect(journalListElementComponent.showThumbnails).toBeTrue();
    });

    it('should add thumbnail element', () => {
      const thumbnailElement = fixture.debugElement.query(By.css('ds-thumbnail'));
      expect(thumbnailElement).toBeTruthy();
    });
  });

  describe('When the item has an issn', () => {
    beforeEach(() => {
      journalListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the journals span', () => {
      const issnField = fixture.debugElement.query(By.css('span.item-list-journals'));
      expect(issnField).not.toBeNull();
    });
  });

  describe('When the item has no issn', () => {
    beforeEach(() => {
      journalListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the journals span', () => {
      const issnField = fixture.debugElement.query(By.css('span.item-list-journals'));
      expect(issnField).toBeNull();
    });
  });
});

describe('JournalSearchResultListElementComponent', () => {

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TruncatePipe, TranslateModule.forRoot(), JournalSearchResultListElementComponent],
      providers: [
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: enviromentNoThumbs },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(JournalSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(JournalSearchResultListElementComponent);
    journalListElementComponent = fixture.componentInstance;
  }));

  describe('with environment.browseBy.showThumbnails set to false', () => {
    beforeEach(() => {

      journalListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should not add thumbnail element', () => {
      const thumbnailElement = fixture.debugElement.query(By.css('ds-thumbnail'));
      expect(thumbnailElement).toBeFalsy();
    });
  });
});
