import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
  cold,
  getTestScheduler,
} from 'jasmine-marbles';
import {
  BehaviorSubject,
  of as observableOf,
} from 'rxjs';

import { storeModuleConfig } from '../app.reducer';
import { authReducer } from '../core/auth/auth.reducer';
import { AuthService } from '../core/auth/auth.service';
import { AuthTokenInfo } from '../core/auth/models/auth-token-info.model';
import { RestResponse } from '../core/cache/response.models';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { EPersonDataService } from '../core/eperson/eperson-data.service';
import { EPerson } from '../core/eperson/models/eperson.model';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';
import { SuggestionsNotificationComponent } from '../notifications/suggestions-notification/suggestions-notification.component';
import { NotificationsService } from '../shared/notifications/notifications.service';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../shared/remote-data.utils';
import {
  EmptySpecialGroupDataMock$,
  SpecialGroupDataMock$,
} from '../shared/testing/special-group.mock';
import { createPaginatedList } from '../shared/testing/utils.test';
import { VarDirective } from '../shared/utils/var.directive';
import { ProfilePageComponent } from './profile-page.component';
import { ThemedProfilePageMetadataFormComponent } from './profile-page-metadata-form/themed-profile-page-metadata-form.component';
import { ProfilePageResearcherFormComponent } from './profile-page-researcher-form/profile-page-researcher-form.component';
import { ProfilePageSecurityFormComponent } from './profile-page-security-form/profile-page-security-form.component';

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  let user;
  let initialState: any;

  let authService;
  let authorizationService;
  let epersonService;
  let notificationsService;
  let configurationService;

  const canChangePassword = new BehaviorSubject(true);
  const validConfiguration = Object.assign(new ConfigurationProperty(), {
    name: 'researcher-profile.entity-type',
    values: [
      'Person',
    ],
  });
  const emptyConfiguration = Object.assign(new ConfigurationProperty(), {
    name: 'researcher-profile.entity-type',
    values: [],
  });

  function init() {
    user = Object.assign(new EPerson(), {
      id: 'userId',
      groups: createSuccessfulRemoteDataObject$(createPaginatedList([])),
      _links: { self: { href: 'test.com/uuid/1234567654321' } },
    });
    initialState = {
      core: {
        auth: {
          authenticated: true,
          loaded: true,
          blocking: false,
          loading: false,
          authToken: new AuthTokenInfo('test_token'),
          userId: user.id,
          authMethods: [],
        },
      },
    };
    authorizationService = jasmine.createSpyObj('authorizationService', { isAuthorized: canChangePassword });
    authService = jasmine.createSpyObj('authService', {
      getAuthenticatedUserFromStore: observableOf(user),
      getSpecialGroupsFromAuthStatus: SpecialGroupDataMock$,
    });
    epersonService = jasmine.createSpyObj('epersonService', {
      findById: createSuccessfulRemoteDataObject$(user),
      patch: observableOf(Object.assign(new RestResponse(true, 200, 'Success'))),
    });
    notificationsService = jasmine.createSpyObj('notificationsService', {
      success: {},
      error: {},
      warning: {},
    });
    configurationService = jasmine.createSpyObj('configurationDataService', {
      findByPropertyName: jasmine.createSpy('findByPropertyName'),
    });
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ auth: authReducer }, storeModuleConfig),
        TranslateModule.forRoot(),
        RouterModule.forRoot([]),
        ProfilePageComponent,
        VarDirective,
      ],
      providers: [
        { provide: EPersonDataService, useValue: epersonService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: AuthService, useValue: authService },
        { provide: ConfigurationDataService, useValue: configurationService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        provideMockStore({ initialState }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ProfilePageComponent, {
        remove: {
          imports: [
            ThemedProfilePageMetadataFormComponent,
            ProfilePageSecurityFormComponent,
            ProfilePageResearcherFormComponent,
            SuggestionsNotificationComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
  });

  describe('', () => {

    beforeEach(() => {
      configurationService.findByPropertyName.and.returnValue(createSuccessfulRemoteDataObject$(validConfiguration));
      fixture.detectChanges();
    });

    describe('updateProfile', () => {
      describe('when the metadata form returns false and the security form returns true', () => {
        beforeEach(() => {
          component.metadataForm = {
            compRef: {
              instance: {
                updateProfile: () => false,
              },
            },
          } as any;
          spyOn(component, 'updateSecurity').and.returnValue(true);
          component.updateProfile();
        });

        it('should not display a warning', () => {
          expect(notificationsService.warning).not.toHaveBeenCalled();
        });
      });

      describe('when the metadata form returns true and the security form returns false', () => {
        beforeEach(() => {
          component.metadataForm = {
            compRef: {
              instance: {
                updateProfile: () => true,
              },
            },
          } as any;
          component.updateProfile();
        });

        it('should not display a warning', () => {
          expect(notificationsService.warning).not.toHaveBeenCalled();
        });
      });

      describe('when the metadata form returns true and the security form returns true', () => {
        beforeEach(() => {
          component.metadataForm = {
            compRef: {
              instance: {
                updateProfile: () => true,
              },
            },
          } as any;
          component.updateProfile();
        });

        it('should not display a warning', () => {
          expect(notificationsService.warning).not.toHaveBeenCalled();
        });
      });

      describe('when the metadata form returns false and the security form returns false', () => {
        beforeEach(() => {
          component.metadataForm = {
            compRef: {
              instance: {
                updateProfile: () => false,
              },
            },
          } as any;
          component.updateProfile();
        });

        it('should display a warning', () => {
          expect(notificationsService.warning).toHaveBeenCalled();
        });
      });
    });

    describe('updateSecurity', () => {
      describe('when no password value present', () => {
        let result;

        beforeEach(() => {
          component.setPasswordValue('');
          component.setCurrentPasswordValue('current-password');
          result = component.updateSecurity();
        });

        it('should return false', () => {
          expect(result).toEqual(false);
        });

        it('should not call epersonService.patch', () => {
          expect(epersonService.patch).not.toHaveBeenCalled();
        });
      });

      describe('when password is filled in, but the password is invalid', () => {
        let result;

        beforeEach(() => {
          component.setPasswordValue('test');
          component.setInvalid(true);
          component.setCurrentPasswordValue('current-password');
          result = component.updateSecurity();
        });

        it('should return true', () => {
          expect(result).toEqual(true);
          expect(epersonService.patch).not.toHaveBeenCalled();
        });
      });

      describe('when password is filled in, and is valid', () => {
        let result;
        let operations;

        beforeEach(() => {
          component.setPasswordValue('testest');
          component.setInvalid(false);
          component.setCurrentPasswordValue('current-password');

          operations = [
            { 'op': 'add', 'path': '/password', 'value': { 'new_password': 'testest', 'current_password': 'current-password' } },
          ];
          result = component.updateSecurity();
        });

        it('should return true', () => {
          expect(result).toEqual(true);
        });

        it('should return call epersonService.patch', () => {
          expect(epersonService.patch).toHaveBeenCalledWith(user, operations);
        });
      });

      describe('when password is filled in, and is valid but return 403', () => {
        let result;
        let operations;

        it('should return call epersonService.patch', (done) => {
          epersonService.patch.and.returnValue(observableOf(Object.assign(new RestResponse(false, 403, 'Error'))));
          component.setPasswordValue('testest');
          component.setInvalid(false);
          component.setCurrentPasswordValue('current-password');
          operations = [
            { 'op': 'add', 'path': '/password', 'value': { 'new_password': 'testest', 'current_password': 'current-password'  } },
          ];
          result = component.updateSecurity();
          epersonService.patch(user, operations).subscribe((response) => {
            expect(response.statusCode).toEqual(403);
            done();
          });
          expect(epersonService.patch).toHaveBeenCalledWith(user, operations);
          expect(result).toEqual(true);
        });
      });
    });

    describe('canChangePassword$', () => {
      describe('when the user is allowed to change their password', () => {
        beforeEach(() => {
          canChangePassword.next(true);
        });

        it('should contain true', () => {
          getTestScheduler().expectObservable(component.canChangePassword$).toBe('(a)', { a: true });
        });

        it('should show the security section on the page', () => {
          fixture.detectChanges();
          expect(fixture.debugElement.query(By.css('.security-section'))).not.toBeNull();
        });
      });

      describe('when the user is not allowed to change their password', () => {
        beforeEach(() => {
          canChangePassword.next(false);
        });

        it('should contain false', () => {
          getTestScheduler().expectObservable(component.canChangePassword$).toBe('(a)', { a: false });
        });

        it('should not show the security section on the page', () => {
          fixture.detectChanges();
          expect(fixture.debugElement.query(By.css('.security-section'))).toBeNull();
        });
      });
    });

    describe('check for specialGroups', () => {
      it('should contains specialGroups list', () => {
        const specialGroupsEle = fixture.debugElement.query(By.css('[data-test="specialGroups"]'));
        expect(specialGroupsEle).toBeTruthy();
      });

      it('should not contains specialGroups list', () => {
        component.specialGroupsRD$ = null;
        fixture.detectChanges();
        const specialGroupsEle = fixture.debugElement.query(By.css('[data-test="specialGroups"]'));
        expect(specialGroupsEle).toBeFalsy();
      });

      it('should not contains specialGroups list', () => {
        component.specialGroupsRD$ = EmptySpecialGroupDataMock$;
        fixture.detectChanges();
        const specialGroupsEle = fixture.debugElement.query(By.css('[data-test="specialGroups"]'));
        expect(specialGroupsEle).toBeFalsy();
      });
    });
  });

  describe('isResearcherProfileEnabled', () => {

    describe('when configuration service return values', () => {

      beforeEach(() => {
        configurationService.findByPropertyName.and.returnValue(createSuccessfulRemoteDataObject$(validConfiguration));
        fixture.detectChanges();
      });

      it('should return true', () => {
        const result = component.isResearcherProfileEnabled();
        const expected = cold('a', {
          a: true,
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('when configuration service return no values', () => {

      beforeEach(() => {
        configurationService.findByPropertyName.and.returnValue(createSuccessfulRemoteDataObject$(emptyConfiguration));
        fixture.detectChanges();
      });

      it('should return false', () => {
        const result = component.isResearcherProfileEnabled();
        const expected = cold('a', {
          a: false,
        });
        expect(result).toBeObservable(expected);
      });
    });

    describe('when configuration service return an error', () => {

      beforeEach(() => {
        configurationService.findByPropertyName.and.returnValue(createFailedRemoteDataObject$());
        fixture.detectChanges();
      });

      it('should return false', () => {
        const result = component.isResearcherProfileEnabled();
        const expected = cold('a', {
          a: false,
        });
        expect(result).toBeObservable(expected);
      });
    });
  });
});
