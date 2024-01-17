import { waitForAsync, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { ProjectListElementComponent } from './project-list-element.component';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../../shared/mocks/dso-name.service.mock';
import { APP_CONFIG } from '../../../../../config/app-config.interface';
import { environment } from '../../../../../environments/environment.test';
import { mockTruncatableService } from '../../../../shared/mocks/mock-trucatable.service';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { AuthServiceMock } from '../../../../shared/mocks/auth.service.mock';
import { getMockThemeService } from '../../../../shared/mocks/theme-service.mock';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../../shared/testing/active-router.stub';
import { TranslateModule } from '@ngx-translate/core';

const mockItem: Item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
  }
});

describe('ProjectListElementComponent', () => {
  let comp;
  let fixture;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TruncatePipe, TranslateModule.forRoot()],
      declarations: [ProjectListElementComponent],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: APP_CONFIG, useValue: environment },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: AuthorizationDataService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ProjectListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
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
