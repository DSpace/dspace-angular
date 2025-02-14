import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { AuthenticateAction } from '../../core/auth/auth.actions';
import { CoreState } from '../../core/core-state.model';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { Registration } from '../../core/shared/registration.model';
import { ProfilePageSecurityFormComponent } from '../../profile-page/profile-page-security-form/profile-page-security-form.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { RouterStub } from '../../shared/testing/router.stub';
import { BrowserOnlyPipe } from '../../shared/utils/browser-only.pipe';
import { ForgotPasswordFormComponent } from './forgot-password-form.component';

describe('ForgotPasswordFormComponent', () => {
  let comp: ForgotPasswordFormComponent;
  let fixture: ComponentFixture<ForgotPasswordFormComponent>;

  let router;
  let route;
  let ePersonDataService: EPersonDataService;
  let notificationsService;
  let store: Store<CoreState>;

  const registration = Object.assign(new Registration(), {
    email: 'test@email.org',
    user: 'test-uuid',
    token: 'test-token',
  });

  beforeEach(waitForAsync(() => {

    route = { data: observableOf({ registration: createSuccessfulRemoteDataObject(registration) }) };
    router = new RouterStub();
    notificationsService = new NotificationsServiceStub();

    ePersonDataService = jasmine.createSpyObj('ePersonDataService', {
      patchPasswordWithToken: createSuccessfulRemoteDataObject$({}),
    });

    store = jasmine.createSpyObj('store', {
      dispatch: {},
    });

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        BrowserOnlyPipe,
        ForgotPasswordFormComponent,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
        { provide: Store, useValue: store },
        { provide: EPersonDataService, useValue: ePersonDataService },
        { provide: UntypedFormBuilder, useValue: new UntypedFormBuilder() },
        { provide: NotificationsService, useValue: notificationsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).overrideComponent(ForgotPasswordFormComponent, {
      remove: { imports: [ ProfilePageSecurityFormComponent ] },
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordFormComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('init', () => {
    it('should initialise mail address', () => {
      const elem = fixture.debugElement.queryAll(By.css('span[data-test="email"]'))[0].nativeElement;
      expect(elem.innerHTML).toContain('test@email.org');
    });
  });

  describe('submit', () => {

    it('should submit a patch request for the user uuid and log in on success', () => {
      comp.password = 'password';
      comp.isInValid = false;

      comp.submit();

      expect(ePersonDataService.patchPasswordWithToken).toHaveBeenCalledWith('test-uuid', 'test-token', 'password');
      expect(store.dispatch).toHaveBeenCalledWith(new AuthenticateAction('test@email.org', 'password'));
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      expect(notificationsService.success).toHaveBeenCalled();
    });

    it('should submit a patch request for the user uuid and stay on page on error', () => {

      (ePersonDataService.patchPasswordWithToken as jasmine.Spy).and.returnValue(createFailedRemoteDataObject$('Error', 500));

      comp.password = 'password';
      comp.isInValid = false;

      comp.submit();

      expect(ePersonDataService.patchPasswordWithToken).toHaveBeenCalledWith('test-uuid', 'test-token', 'password');
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(notificationsService.error).toHaveBeenCalled();
    });

    it('should submit a patch request for the user uuid when the form is invalid', () => {

      comp.password = 'password';
      comp.isInValid = true;

      comp.submit();

      expect(ePersonDataService.patchPasswordWithToken).not.toHaveBeenCalled();
    });
  });
});
