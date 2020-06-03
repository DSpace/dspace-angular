import { ProfilePageComponent } from './profile-page.component';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { VarDirective } from '../shared/utils/var.directive';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EPerson } from '../core/eperson/models/eperson.model';
import { Store, StoreModule } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { AuthTokenInfo } from '../core/auth/models/auth-token-info.model';
import { EPersonDataService } from '../core/eperson/eperson-data.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { authReducer } from '../core/auth/auth.reducer';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { createPaginatedList } from '../shared/testing/utils.test';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../core/auth/auth.service';

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  let user;
  let authState;

  let authService;
  let epersonService;
  let notificationsService;

  function init() {
    user = Object.assign(new EPerson(), {
      id: 'userId',
      groups: createSuccessfulRemoteDataObject$(createPaginatedList([]))
    });
    authState = {
      authenticated: true,
      loaded: true,
      loading: false,
      authToken: new AuthTokenInfo('test_token'),
      userId: user.id
    };

    authService = jasmine.createSpyObj('authService', {
      getAuthenticatedUserFromStore: of(user)
    });
    epersonService = jasmine.createSpyObj('epersonService', {
      findById: createSuccessfulRemoteDataObject$(user)
    });
    notificationsService = jasmine.createSpyObj('notificationsService', {
      success: {},
      error: {},
      warning: {}
    });
  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [ProfilePageComponent, VarDirective],
      imports: [StoreModule.forRoot(authReducer), TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: EPersonDataService, useValue: epersonService },
        { provide: NotificationsService, useValue: notificationsService },
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

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('updateProfile', () => {
    describe('when the metadata form returns false and the security form returns true', () => {
      beforeEach(() => {
        component.metadataForm = jasmine.createSpyObj('metadataForm', {
          updateProfile: false
        });
        component.securityForm = jasmine.createSpyObj('securityForm', {
          updateSecurity: true
        });
        component.updateProfile();
      });

      it('should not display a warning', () => {
        expect(notificationsService.warning).not.toHaveBeenCalled();
      });
    });

    describe('when the metadata form returns true and the security form returns false', () => {
      beforeEach(() => {
        component.metadataForm = jasmine.createSpyObj('metadataForm', {
          updateProfile: true
        });
        component.securityForm = jasmine.createSpyObj('securityForm', {
          updateSecurity: false
        });
        component.updateProfile();
      });

      it('should not display a warning', () => {
        expect(notificationsService.warning).not.toHaveBeenCalled();
      });
    });

    describe('when the metadata form returns true and the security form returns true', () => {
      beforeEach(() => {
        component.metadataForm = jasmine.createSpyObj('metadataForm', {
          updateProfile: true
        });
        component.securityForm = jasmine.createSpyObj('securityForm', {
          updateSecurity: true
        });
        component.updateProfile();
      });

      it('should not display a warning', () => {
        expect(notificationsService.warning).not.toHaveBeenCalled();
      });
    });

    describe('when the metadata form returns false and the security form returns false', () => {
      beforeEach(() => {
        component.metadataForm = jasmine.createSpyObj('metadataForm', {
          updateProfile: false
        });
        component.securityForm = jasmine.createSpyObj('securityForm', {
          updateSecurity: false
        });
        component.updateProfile();
      });

      it('should display a warning', () => {
        expect(notificationsService.warning).toHaveBeenCalled();
      });
    });
  });
});
