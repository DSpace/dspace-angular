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
import { of } from 'rxjs';

import { APP_CONFIG } from '../../../../../../config/app-config.interface';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { Item } from '../../../../../core/shared/item.model';
import { DSONameServiceMock } from '../../../../../shared/mocks/dso-name.service.mock';
import { mockTruncatableService } from '../../../../../shared/mocks/mock-trucatable.service';
import { getMockThemeService } from '../../../../../shared/mocks/theme-service.mock';
import { ThemedBadgesComponent } from '../../../../../shared/object-collection/shared/badges/themed-badges.component';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { ActivatedRouteStub } from '../../../../../shared/testing/active-router.stub';
import { ThemeService } from '../../../../../shared/theme-support/theme.service';
import { TruncatableComponent } from '../../../../../shared/truncatable/truncatable.component';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { TruncatablePartComponent } from '../../../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { TruncatePipe } from '../../../../../shared/utils/truncate.pipe';
import { ThemedThumbnailComponent } from '../../../../../thumbnail/themed-thumbnail.component';
import { JournalIssueSearchResultListElementComponent } from './journal-issue-search-result-list-element.component';

let journalIssueListElementComponent: JournalIssueSearchResultListElementComponent;
let fixture: ComponentFixture<JournalIssueSearchResultListElementComponent>;

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
        'publicationvolume.volumeNumber': [
          {
            language: 'en_US',
            value: '1234',
          },
        ],
        'publicationissue.issueNumber': [
          {
            language: 'en_US',
            value: '5678',
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
  });

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

describe('JournalIssueSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        TruncatePipe,
        JournalIssueSearchResultListElementComponent,
      ],
      providers: [
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environmentUseThumbs },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: APP_CONFIG, useValue: environmentUseThumbs },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(JournalIssueSearchResultListElementComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default } ,
      remove: {
        imports: [ThemedThumbnailComponent, ThemedBadgesComponent, TruncatableComponent, TruncatablePartComponent],
      } },
    ).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(JournalIssueSearchResultListElementComponent);
    journalIssueListElementComponent = fixture.componentInstance;

  }));

  describe('with environment.browseBy.showThumbnails set to true', () => {
    beforeEach(() => {
      journalIssueListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });
    it('should set showThumbnails to true', () => {
      expect(journalIssueListElementComponent.showThumbnails).toBeTrue();
    });

    it('should add thumbnail element', () => {
      const thumbnailElement = fixture.debugElement.query(By.css('ds-thumbnail'));
      expect(thumbnailElement).toBeTruthy();
    });
  });


  describe('When the item has a journal identifier', () => {
    beforeEach(() => {
      journalIssueListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the journal issues span', () => {
      const journalIdentifierField = fixture.debugElement.query(By.css('span.item-list-journal-issues'));
      expect(journalIdentifierField).not.toBeNull();
    });
  });

  describe('When the item has no journal identifier', () => {
    beforeEach(() => {
      journalIssueListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the journal issues span', () => {
      const journalIdentifierField = fixture.debugElement.query(By.css('span.item-list-journal-issues'));
      expect(journalIdentifierField).toBeNull();
    });
  });

  describe('When the item has a journal number', () => {
    beforeEach(() => {
      journalIssueListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the journal issue numbers span', () => {
      const journalNumberField = fixture.debugElement.query(By.css('span.item-list-journal-issue-numbers'));
      expect(journalNumberField).not.toBeNull();
    });
  });

  describe('When the item has no journal number', () => {
    beforeEach(() => {
      journalIssueListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the journal issue numbers span', () => {
      const journalNumberField = fixture.debugElement.query(By.css('span.item-list-journal-issue-numbers'));
      expect(journalNumberField).toBeNull();
    });
  });
});

describe('JournalIssueSearchResultListElementComponent', () => {

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TruncatePipe, TranslateModule.forRoot(), JournalIssueSearchResultListElementComponent],
      providers: [
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: enviromentNoThumbs },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(JournalIssueSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(JournalIssueSearchResultListElementComponent);
    journalIssueListElementComponent = fixture.componentInstance;
  }));

  describe('with environment.browseBy.showThumbnails set to false', () => {
    beforeEach(() => {

      journalIssueListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should not add thumbnail element', () => {
      const thumbnailElement = fixture.debugElement.query(By.css('ds-thumbnail'));
      expect(thumbnailElement).toBeFalsy();
    });
  });
});
