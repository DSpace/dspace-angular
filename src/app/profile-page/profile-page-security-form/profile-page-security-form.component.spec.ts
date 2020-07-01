import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EPerson } from '../../core/eperson/models/eperson.model';
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

  let user;

  let epersonService;
  let notificationsService;

  function init() {
    user = Object.assign(new EPerson(), {
      _links: {
        self: { href: 'user-selflink' }
      }
    });

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
        { provide: EPersonDataService, useValue: epersonService },
        { provide: NotificationsService, useValue: notificationsService },
        FormBuilderService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePageSecurityFormComponent);
    component = fixture.componentInstance;
    component.user = user;
    fixture.detectChanges();
  });

  describe('updateSecurity', () => {
    describe('when no values changed', () => {
      let result;

      beforeEach(() => {
        result = component.updateSecurity();
      });

      it('should return false', () => {
        expect(result).toEqual(false);
      });

      it('should not call epersonService.patch', () => {
        expect(epersonService.patch).not.toHaveBeenCalled();
      });
    });

    describe('when password is filled in, but the confirm field is empty', () => {
      let result;

      beforeEach(() => {
        setModelValue('password', 'test');
        result = component.updateSecurity();
      });

      it('should return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe('when both password fields are filled in, long enough and equal', () => {
      let result;
      let operations;

      beforeEach(() => {
        setModelValue('password', 'testest');
        setModelValue('passwordrepeat', 'testest');
        operations = [{ op: 'replace', path: '/password', value: 'testest' }];
        result = component.updateSecurity();
      });

      it('should return true', () => {
        expect(result).toEqual(true);
      });

      it('should return call epersonService.patch', () => {
        expect(epersonService.patch).toHaveBeenCalledWith(user, operations);
      });
    });
  });

  function setModelValue(id: string, value: string) {
    component.formGroup.patchValue({
      [id]: value
    });
    component.formGroup.markAllAsTouched();
  }
});
