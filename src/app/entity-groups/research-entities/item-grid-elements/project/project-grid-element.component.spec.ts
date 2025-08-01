import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { DSONameService } from '@core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '@core/data/bitstream-data.service';
import { AuthorizationDataService } from '@core/data/feature-authorization/authorization-data.service';
import { buildPaginatedList } from '@core/data/paginated-list.model';
import { Item } from '@core/shared/item.model';
import { PageInfo } from '@core/shared/page-info.model';
import { ActivatedRouteStub } from '@core/testing/active-router.stub';
import { AuthServiceMock } from '@core/testing/auth.service.mock';
import { DSONameServiceMock } from '@core/testing/dso-name.service.mock';
import { mockTruncatableService } from '@core/testing/mock-trucatable.service';
import { createSuccessfulRemoteDataObject$ } from '@core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';

import { getMockThemeService } from '../../../../shared/theme-support/test/theme-service.mock';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { ProjectGridElementComponent } from './project-grid-element.component';

const mockItem = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'dc.description': [
      {
        language: 'en_US',
        value: 'The project description',
      },
    ],
  },
});

describe('ProjectGridElementComponent', () => {
  let comp;
  let fixture;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TruncatePipe, TranslateModule.forRoot(), ProjectGridElementComponent],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: BitstreamDataService, useValue: {} },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: AuthorizationDataService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ProjectGridElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ProjectGridElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the project is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a ProjectGridElementComponent`, () => {
      const projectGridElement = fixture.debugElement.query(By.css(`ds-project-search-result-grid-element`));
      expect(projectGridElement).not.toBeNull();
    });
  });
});
