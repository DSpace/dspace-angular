import {
  NO_ERRORS_SCHEMA,
  PLATFORM_ID,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { APP_DATA_SERVICES_MAP } from '../../config/app-config.interface';
import { AuthService } from '../core/auth/auth.service';
import { XSRFService } from '../core/xsrf/xsrf.service';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { ThemedLogInComponent } from '../shared/log-in/themed-log-in.component';
import { AuthServiceMock } from '../shared/mocks/auth.service.mock';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let comp: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    params: observableOf({}),
  });

  const store: Store<LoginPageComponent> = jasmine.createSpyObj('store', {
    /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
    dispatch: {},
    /* eslint-enable no-empty, @typescript-eslint/no-empty-function */
    select: observableOf(true),
  });

  describe('when platform is browser', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot(),
          LoginPageComponent,
        ],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteStub },
          { provide: AuthService, useValue: new AuthServiceMock() },
          { provide: XSRFService, useValue: {} },
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: APP_DATA_SERVICES_MAP, useValue: {} },
          provideMockStore({}),
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).overrideComponent(LoginPageComponent, { remove: { imports: [ThemedLoadingComponent, ThemedLogInComponent] } }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(LoginPageComponent);
      comp = fixture.componentInstance; // SearchPageComponent test instance
      fixture.detectChanges();
    });

    it('should create instance', () => {
      const login = fixture.debugElement.query(By.css('[data-test="login"]'));
      const loading = fixture.debugElement.query(By.css('[data-test="loading"]'));
      expect(login).toBeTruthy();
      expect(loading).toBeFalsy();
    });
  });

  describe('when platform is server', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot(),
          LoginPageComponent,
        ],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteStub },
          { provide: AuthService, useValue: new AuthServiceMock() },
          { provide: XSRFService, useValue: {} },
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: APP_DATA_SERVICES_MAP, useValue: {} },
          provideMockStore({}),
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(LoginPageComponent);
      comp = fixture.componentInstance; // SearchPageComponent test instance
      fixture.detectChanges();
    });

    it('should create instance', () => {
      const login = fixture.debugElement.query(By.css('[data-test="login"]'));
      const loading = fixture.debugElement.query(By.css('[data-test="loading"]'));
      expect(login).toBeFalsy();
      expect(loading).toBeTruthy();
    });
  });

});
