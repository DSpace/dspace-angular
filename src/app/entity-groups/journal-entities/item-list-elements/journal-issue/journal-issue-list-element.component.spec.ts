import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { APP_CONFIG } from '../../../../../config/app-config.interface';
import { environment } from '../../../../../environments/environment.test';
import { AuthService } from '../../../../core/auth/auth.service';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { Item } from '../../../../core/shared/item.model';
import { AuthServiceMock } from '../../../../shared/mocks/auth.service.mock';
import { DSONameServiceMock } from '../../../../shared/mocks/dso-name.service.mock';
import { mockTruncatableService } from '../../../../shared/mocks/mock-trucatable.service';
import { getMockThemeService } from '../../../../shared/mocks/theme-service.mock';
import { ActivatedRouteStub } from '../../../../shared/testing/active-router.stub';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { JournalIssueListElementComponent } from './journal-issue-list-element.component';

const mockItem: Item = Object.assign(new Item(), {
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
});

describe('JournalIssueListElementComponent', () => {
  let comp;
  let fixture;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TruncatePipe, TranslateModule.forRoot(), JournalIssueListElementComponent],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: APP_CONFIG, useValue: environment },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: AuthorizationDataService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(JournalIssueListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(JournalIssueListElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the journal issue is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a JournalIssueListElementComponent`, () => {
      const journalIssueListElement = fixture.debugElement.query(By.css(`ds-journal-issue-search-result-list-element`));
      expect(journalIssueListElement).not.toBeNull();
    });
  });

});
