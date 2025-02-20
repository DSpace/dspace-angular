import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { AuthService } from '../core/auth/auth.service';
import { APP_DATA_SERVICES_MAP } from '../core/config/app-config.interface';
import { AuthServiceMock } from '../core/mocks/auth.service.mock';
import { ActivatedRouteStub } from '../core/utilities/testing/active-router.stub';
import { XSRFService } from '../core/xsrf/xsrf.service';
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
    expect(comp).toBeDefined();
  });

});
