import { NO_ERRORS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { XSRFService } from '../core/xsrf/xsrf.service';
import { LoginPageComponent } from './login-page.component';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { By } from '@angular/platform-browser';

describe('LoginPageComponent', () => {
  let comp: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    params: observableOf({})
  });

  const store: Store<LoginPageComponent> = jasmine.createSpyObj('store', {
    /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
    dispatch: {},
    /* eslint-enable no-empty, @typescript-eslint/no-empty-function */
    select: observableOf(true)
  });

  describe('when platform is browser', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot()
        ],
        declarations: [LoginPageComponent],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteStub },
          { provide: Store, useValue: store },
          { provide: XSRFService, useValue: {} },
          { provide: PLATFORM_ID, useValue: 'browser' }
        ],
        schemas: [NO_ERRORS_SCHEMA]
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
      expect(login).toBeTruthy();
      expect(loading).toBeFalsy();
    });
  });

  describe('when platform is browser', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot()
        ],
        declarations: [LoginPageComponent],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteStub },
          { provide: Store, useValue: store },
          { provide: PLATFORM_ID, useValue: 'server' }
        ],
        schemas: [NO_ERRORS_SCHEMA]
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
