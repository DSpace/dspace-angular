import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import {
  AuthService,
  DSONameService,
  BitstreamDataService,
  AuthorizationDataService,
  buildPaginatedList,
  Item,
  PageInfo,
  ActivatedRouteStub,
  AuthServiceMock,
  DSONameServiceMock,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core'
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { getMockThemeService } from '../../../../shared/theme-support/test/theme-service.mock';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { JournalVolumeGridElementComponent } from './journal-volume-grid-element.component';

const mockItem = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'creativework.datePublished': [
      {
        language: null,
        value: '2015-06-26',
      },
    ],
    'dc.description': [
      {
        language: 'en_US',
        value: 'A description for the journal volume',
      },
    ],
  },
});

describe('JournalVolumeGridElementComponent', () => {
  let comp;
  let fixture;

  const truncatableServiceStub: any = {
    isCollapsed: (id: number) => of(true),
    expand: (id: number) => null,
    collapse: (id: number) => null,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TruncatePipe, TranslateModule.forRoot(), JournalVolumeGridElementComponent],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: BitstreamDataService, useValue: {} },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: AuthorizationDataService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(JournalVolumeGridElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(JournalVolumeGridElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the journal volume is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a JournalVolumeSearchResultGridElementComponent`, () => {
      const journalVolumeGridElement = fixture.debugElement.query(By.css(`ds-journal-volume-search-result-grid-element`));
      expect(journalVolumeGridElement).not.toBeNull();
    });
  });
});
