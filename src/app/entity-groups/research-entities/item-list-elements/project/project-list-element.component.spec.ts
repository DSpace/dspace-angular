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
import { of as observableOf } from 'rxjs';

import { environment } from '../../../../../environments/environment.test';
import { AuthService } from '../../../../core/auth/auth.service';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { APP_CONFIG } from '../../../../core/config/app-config.interface';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { AuthServiceMock } from '../../../../core/mocks/auth.service.mock';
import { DSONameServiceMock } from '../../../../core/mocks/dso-name.service.mock';
import { mockTruncatableService } from '../../../../core/mocks/mock-trucatable.service';
import { getMockThemeService } from '../../../../core/mocks/theme-service.mock';
import { Item } from '../../../../core/shared/item.model';
import { ActivatedRouteStub } from '../../../../core/utilities/testing/active-router.stub';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { ProjectListElementComponent } from './project-list-element.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
  },
});

describe('ProjectListElementComponent', () => {
  let comp;
  let fixture;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TruncatePipe, TranslateModule.forRoot(), ProjectListElementComponent],
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
    }).overrideComponent(ProjectListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ProjectListElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the project is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a ProjectListElementComponent`, () => {
      const projectListElement = fixture.debugElement.query(By.css(`ds-project-search-result-list-element`));
      expect(projectListElement).not.toBeNull();
    });
  });
});
