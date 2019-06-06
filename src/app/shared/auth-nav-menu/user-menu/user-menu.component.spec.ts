import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { UserMenuComponent } from './user-menu.component';
import { authReducer, AuthState } from '../../../core/auth/auth.reducer';
import { AuthTokenInfo } from '../../../core/auth/models/auth-token-info.model';
import { EPersonMock } from '../../testing/eperson-mock';
import { AppState } from '../../../app.reducer';
import { MockTranslateLoader } from '../../mocks/mock-translate-loader';
import { cold } from 'jasmine-marbles';
import { By } from '@angular/platform-browser';

describe('UserMenuComponent', () => {

  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;
  let deUserMenu: DebugElement;
  let authState: AuthState;
  let authStateLoading: AuthState;

  function init() {
    authState = {
      authenticated: true,
      loaded: true,
      loading: false,
      authToken: new AuthTokenInfo('test_token'),
      user: EPersonMock
    };
    authStateLoading = {
      authenticated: true,
      loaded: true,
      loading: true,
      authToken: null,
      user: EPersonMock
    };
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(authReducer),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        })
      ],
      declarations: [
        UserMenuComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();

  }));

  beforeEach(() => {
    init();
  });

  describe('when auth state is loading', () => {
    beforeEach(inject([Store], (store: Store<AppState>) => {
      store
        .subscribe((state) => {
          (state as any).core = Object.create({});
          (state as any).core.auth = authStateLoading;
        });

      // create component and test fixture
      fixture = TestBed.createComponent(UserMenuComponent);

      // get test component from the fixture
      component = fixture.componentInstance;

      fixture.detectChanges();

      deUserMenu = fixture.debugElement.query(By.css('div'));
    }));

    afterEach(() => {
      fixture.destroy();
    });

    it('should init component properly', () => {
      expect(component).toBeDefined();

      expect(component.loading$).toBeObservable(cold('b', {
        b: true
      }));

      expect(component.user$).toBeObservable(cold('c', {
        c: EPersonMock
      }));

      expect(deUserMenu).toBeNull();
    });

  });

  describe('when auth state is not loading', () => {
    beforeEach(inject([Store], (store: Store<AppState>) => {
      store
        .subscribe((state) => {
          (state as any).core = Object.create({});
          (state as any).core.auth = authState;
        });

      // create component and test fixture
      fixture = TestBed.createComponent(UserMenuComponent);

      // get test component from the fixture
      component = fixture.componentInstance;

      fixture.detectChanges();

      deUserMenu = fixture.debugElement.query(By.css('div'));
    }));

    afterEach(() => {
      fixture.destroy();
    });

    it('should init component properly', () => {
      expect(component).toBeDefined();

      expect(component.loading$).toBeObservable(cold('b', {
        b: false
      }));

      expect(component.user$).toBeObservable(cold('c', {
        c: EPersonMock
      }));

      expect(deUserMenu).toBeDefined();
    });

    it('should display user name and email', () =>  {
      const user = 'User Test (test@test.com)';
      const span = deUserMenu.query(By.css('.dropdown-item-text'));
      expect(span).toBeDefined();
      expect(span.nativeElement.innerHTML).toBe(user);
    })

  });

});
