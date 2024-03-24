import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { RestResponse } from '../../core/cache/response.models';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { FormBuilderService } from '../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../shared/form/form.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { VarDirective } from '../../shared/utils/var.directive';
import { ProfilePageSecurityFormComponent } from './profile-page-security-form.component';

describe('ProfilePageSecurityFormComponent', () => {
  let component: ProfilePageSecurityFormComponent;
  let fixture: ComponentFixture<ProfilePageSecurityFormComponent>;

  let epersonService;
  let notificationsService;

  function init() {
    epersonService = jasmine.createSpyObj('epersonService', {
      patch: observableOf(new RestResponse(true, 200, 'OK')),
    });
    notificationsService = jasmine.createSpyObj('notificationsService', {
      success: {},
      error: {},
      warning: {},
    });
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        ProfilePageSecurityFormComponent,
        VarDirective,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: EPersonDataService, useValue: epersonService },
        { provide: NotificationsService, useValue: notificationsService },
        FormBuilderService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ProfilePageSecurityFormComponent, {
      remove: { imports: [ FormComponent, AlertComponent ] },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePageSecurityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('On value change', () => {
    describe('when the password has changed', () => {
      beforeEach(() => {
        component.formGroup.patchValue({ password: 'password' });
        component.formGroup.patchValue({ passwordrepeat: 'password' });
      });

      it('should emit the value and validity on password change with invalid validity', fakeAsync(() => {
        spyOn(component.passwordValue, 'emit');
        spyOn(component.isInvalid, 'emit');
        component.formGroup.patchValue({ password: 'new-password' });

        tick(300);

        expect(component.passwordValue.emit).toHaveBeenCalledWith('new-password');
        expect(component.isInvalid.emit).toHaveBeenCalledWith(true);
      }));

      it('should emit the value on password change', fakeAsync(() => {
        spyOn(component.passwordValue, 'emit');
        component.formGroup.patchValue({ password: 'new-password' });

        tick(300);

        expect(component.passwordValue.emit).toHaveBeenCalledWith('new-password');
      }));

      it('should emit the value on password change with current password for profile-page', fakeAsync(() => {
        spyOn(component.passwordValue, 'emit');
        spyOn(component.currentPasswordValue, 'emit');
        component.FORM_PREFIX = 'profile.security.form.';
        component.ngOnInit();
        component.formGroup.patchValue({ password: 'new-password' });
        component.formGroup.patchValue({ 'current-password': 'current-password' });
        tick(300);

        expect(component.passwordValue.emit).toHaveBeenCalledWith('new-password');
        expect(component.currentPasswordValue.emit).toHaveBeenCalledWith('current-password');
      }));
    });
  });
});
