import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VarDirective } from '../../shared/utils/var.directive';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FormBuilderService } from '../../shared/form/builder/form-builder.service';
import { ProfilePageSecurityFormComponent } from './profile-page-security-form.component';
import { of as observableOf } from 'rxjs';
import { RestResponse } from '../../core/cache/response.models';

describe('ProfilePageSecurityFormComponent', () => {
  let component: ProfilePageSecurityFormComponent;
  let fixture: ComponentFixture<ProfilePageSecurityFormComponent>;

  let epersonService;
  let notificationsService;

  function init() {
    epersonService = jasmine.createSpyObj('epersonService', {
      patch: observableOf(new RestResponse(true, 200, 'OK'))
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
      declarations: [ProfilePageSecurityFormComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        {provide: EPersonDataService, useValue: epersonService},
        {provide: NotificationsService, useValue: notificationsService},
        FormBuilderService
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
        component.formGroup.patchValue({password: 'password'});
        component.formGroup.patchValue({passwordrepeat: 'password'});
      });

      it('should emit the value and validity on password change with invalid validity', fakeAsync(() => {
        spyOn(component.passwordValue, 'emit');
        spyOn(component.isInvalid, 'emit');
        component.formGroup.patchValue({password: 'new-password'});

        tick(300);

        expect(component.passwordValue.emit).toHaveBeenCalledWith('new-password');
        expect(component.isInvalid.emit).toHaveBeenCalledWith(true);
      }));

      it('should emit the value on password change', fakeAsync(() => {
        spyOn(component.passwordValue, 'emit');
        component.formGroup.patchValue({password: 'new-password'});

        tick(300);

        expect(component.passwordValue.emit).toHaveBeenCalledWith('new-password');
      }));
    });
  });
});
