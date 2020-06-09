import { ImpersonateNavbarComponent } from './impersonate-navbar.component';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { VarDirective } from '../utils/var.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Store, StoreModule } from '@ngrx/store';
import { authReducer, AuthState } from '../../core/auth/auth.reducer';
import { AuthTokenInfo } from '../../core/auth/models/auth-token-info.model';
import { EPersonMock } from '../testing/eperson.mock';
import { AppState } from '../../app.reducer';
import { By } from '@angular/platform-browser';

describe('ImpersonateNavbarComponent', () => {
  let component: ImpersonateNavbarComponent;
  let fixture: ComponentFixture<ImpersonateNavbarComponent>;
  let authService: AuthService;
  let authState: AuthState;

  beforeEach(async(() => {
    authService = jasmine.createSpyObj('authService', {
      isImpersonating: false,
      stopImpersonatingAndRefresh: {}
    });
    authState = {
      authenticated: true,
      loaded: true,
      loading: false,
      authToken: new AuthTokenInfo('test_token'),
      userId: EPersonMock.id
    };

    TestBed.configureTestingModule({
      declarations: [ImpersonateNavbarComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), StoreModule.forRoot(authReducer)],
      providers: [
        { provide: AuthService, useValue: authService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(inject([Store], (store: Store<AppState>) => {
    store
      .subscribe((state) => {
        (state as any).core = Object.create({});
        (state as any).core.auth = authState;
      });

    fixture = TestBed.createComponent(ImpersonateNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('when the user is impersonating another user', () => {
    beforeEach(() => {
      component.isImpersonating = true;
      fixture.detectChanges();
    });

    it('should display a button', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button).not.toBeNull();
    });

    it('should call authService\'s stopImpersonatingAndRefresh upon clicking the button', () => {
      const button = fixture.debugElement.query(By.css('button')).nativeElement;
      button.click();
      expect(authService.stopImpersonatingAndRefresh).toHaveBeenCalled();
    });
  });

  describe('when the user is not impersonating another user', () => {
    it('should not display a button', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button).toBeNull();
    });
  });
});
