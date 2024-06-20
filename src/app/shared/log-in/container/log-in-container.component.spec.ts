import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { LogInContainerComponent } from './log-in-container.component';
import { authReducer } from '../../../core/auth/auth.reducer';
import { SharedModule } from '../../shared.module';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthMethod } from '../../../core/auth/models/auth.method';
import { AuthServiceStub } from '../../testing/auth-service.stub';
import { createTestComponent } from '../../testing/utils.test';
import { HardRedirectService } from '../../../core/services/hard-redirect.service';
import { AuthMethodType } from '../../../core/auth/models/auth.method-type';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { AuthorizationDataServiceStub } from '../../testing/authorization-service.stub';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf } from 'rxjs';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { RouterMock } from '../../mocks/router.mock';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from '../../../core/services/cookie.service';
import { CookieServiceMock } from '../../mocks/cookie.service.mock';

describe('LogInContainerComponent', () => {

  let component: LogInContainerComponent;
  let fixture: ComponentFixture<LogInContainerComponent>;

  const authMethod = new AuthMethod(AuthMethodType.Password, 0);

  let hardRedirectService: HardRedirectService;
  let configurationDataService: ConfigurationDataService;
  let authService: any;

  beforeEach(waitForAsync(() => {
    hardRedirectService = jasmine.createSpyObj('hardRedirectService', {
      redirect: {},
      getCurrentRoute: {}
    });
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true),
      setRedirectUrl: {},
      setRedirectUrlIfNotSet: {}
    });
    configurationDataService = jasmine.createSpyObj('configurationDataService', {
      findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
        name: 'dspace.ui.url',
        values: [
          'some url'
        ]
      }))
    });

    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot(authReducer),
        SharedModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      declarations: [
        TestComponent
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: AuthorizationDataService, useClass: AuthorizationDataServiceStub },
        { provide: HardRedirectService, useValue: hardRedirectService },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: ActivatedRoute, useValue: {
            params: observableOf({}),
            data: observableOf({ metadata: 'title' }),
            snapshot: {
              queryParams: new Map([
                ['redirectUrl', 'some url'],
              ])
            }
          } },
        { provide: Router, useValue: new RouterMock() },
        { provide: CookieService, useClass: CookieServiceMock },
        LogInContainerComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();

  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `<ds-log-in-container [authMethod]="authMethod"> </ds-log-in-container>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;

    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create LogInContainerComponent', inject([LogInContainerComponent], (app: LogInContainerComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LogInContainerComponent);
      component = fixture.componentInstance;

      spyOn(component, 'getAuthMethodContent').and.callThrough();
      component.authMethod = authMethod;
      fixture.detectChanges();
    });

    afterEach(() => {
      fixture.destroy();
      component = null;
    });

    it('should inject component properly', () => {

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.getAuthMethodContent).toHaveBeenCalled();

    });

  });

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  isStandalonePage = true;
  authMethod = new AuthMethod(AuthMethodType.Password, 0);

}
