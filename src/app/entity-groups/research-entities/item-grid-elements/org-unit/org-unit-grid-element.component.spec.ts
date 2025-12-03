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
import { AuthService } from '@dspace/core/auth/auth.service';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { buildPaginatedList } from '@dspace/core/data/paginated-list.model';
import { Item } from '@dspace/core/shared/item.model';
import { PageInfo } from '@dspace/core/shared/page-info.model';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { AuthServiceMock } from '@dspace/core/testing/auth.service.mock';
import { DSONameServiceMock } from '@dspace/core/testing/dso-name.service.mock';
import { mockTruncatableService } from '@dspace/core/testing/mock-trucatable.service';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';

import { getMockThemeService } from '../../../../shared/theme-support/test/theme-service.mock';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { OrgUnitGridElementComponent } from './org-unit-grid-element.component';

const mockItem = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'organization.foundingDate': [
      {
        language: null,
        value: '2015-06-26',
      },
    ],
    'organization.address.addressCountry': [
      {
        language: 'en_US',
        value: 'Belgium',
      },
    ],
    'organization.address.addressLocality': [
      {
        language: 'en_US',
        value: 'Brussels',
      },
    ],
  },
});

describe('OrgUnitGridElementComponent', () => {
  let comp;
  let fixture;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TruncatePipe,
        TranslateModule.forRoot(),
        OrgUnitGridElementComponent,
      ],
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
    }).overrideComponent(OrgUnitGridElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(OrgUnitGridElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the org unit is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a OrgUnitGridElementComponent`, () => {
      const orgUnitGridElement = fixture.debugElement.query(By.css(`ds-org-unit-search-result-grid-element`));
      expect(orgUnitGridElement).not.toBeNull();
    });
  });
});
