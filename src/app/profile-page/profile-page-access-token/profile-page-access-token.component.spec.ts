import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ProfilePageAccessTokenComponent } from './profile-page-access-token.component';
import { AuthService } from '../../core/auth/auth.service';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { By } from '@angular/platform-browser';
import {
  createFailedRemoteDataObject$,
  createNoContentRemoteDataObject$,
  createSuccessfulRemoteDataObject$
} from '../../shared/remote-data.utils';
import { MachineToken } from '../../core/auth/models/machine-token.model';

describe('ProfilePageAccessTokenComponent', () => {
  let component: ProfilePageAccessTokenComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<ProfilePageAccessTokenComponent>;
  let scheduler: TestScheduler;
  let authServiceStub = jasmine.createSpyObj('AuthService', {
    createMachineToken: jasmine.createSpy('createMachineToken'),
    deleteMachineToken: jasmine.createSpy('deleteMachineToken')
  });
  const mockEPersonWithoutToken = Object.assign(new EPerson(), {
    machineTokenGenerated: false
  });

  const mockEPersonWithToken = Object.assign(new EPerson(), {
    machineTokenGenerated: true
  });

  const machineTokenMock = Object.assign(new MachineToken(), {
    value: 'test-machine-token'
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [ProfilePageAccessTokenComponent],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        Clipboard,
        NgbModal,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePageAccessTokenComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
  });

  describe('when person have not generated a new machine token', () => {

    describe('and token have not been never generated before', () => {

      beforeEach(() => {
        component.user = mockEPersonWithoutToken;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should show proper information to user', () => {
        expect(fixture.debugElement.query(By.css('[data-test="notGenerated"]'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('[data-test="infoAlert"]'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('[data-test="createBtn"]'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('[data-test="warningAlert"]'))).toBeNull();
        expect(fixture.debugElement.query(By.css('[data-test="revokeBtn"]'))).toBeNull();
      });

      describe('and user generate token', () => {
        it('should call directly processTokenGeneration method', () => {
          spyOn(componentAsAny, 'processTokenGeneration').and.stub();
          spyOn(componentAsAny.modalService, 'open').and.callThrough();
          component.generateToken();
          expect(componentAsAny.processTokenGeneration).toHaveBeenCalled();
          expect(componentAsAny.modalService.open).not.toHaveBeenCalled();
        });

        it('should show the token information on success', fakeAsync(() => {
          scheduler = getTestScheduler();
          componentAsAny.authService.createMachineToken.and.returnValue(createSuccessfulRemoteDataObject$(machineTokenMock));
          scheduler.schedule(() => componentAsAny.processTokenGeneration());
          scheduler.flush();
          console.log('test');
          expect(component.generatedToken.value).toBe(machineTokenMock.value);
          expect(component.tokenAlreadyExists.value).toBeTrue();
        }));

        it('should show the notification on error', fakeAsync(() => {
          scheduler = getTestScheduler();
          componentAsAny.authService.createMachineToken.and.returnValue(createFailedRemoteDataObject$());
          scheduler.schedule(() => componentAsAny.processTokenGeneration());
          scheduler.flush();
          expect(componentAsAny.notificationService.error).toHaveBeenCalled();
        }));

      });

    });

    describe('and token have been already generated before', () => {

      beforeEach(() => {
        component.user = mockEPersonWithToken;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should show proper information to user', () => {
        expect(fixture.debugElement.query(By.css('[data-test="notGenerated"]'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('[data-test="infoAlert"]'))).toBeNull();
        expect(fixture.debugElement.query(By.css('[data-test="createBtn"]'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('[data-test="warningAlert"]'))).toBeTruthy();
        expect(fixture.debugElement.query(By.css('[data-test="revokeBtn"]'))).toBeTruthy();
      });

      describe('and user generate token', () => {
        it('should show modal before to call processTokenGeneration method', () => {
          spyOn(componentAsAny, 'processTokenGeneration').and.stub();
          spyOn(componentAsAny.modalService, 'open').and.callThrough();
          component.generateToken();
          expect(componentAsAny.modalService.open).toHaveBeenCalled();
        });

        it('should show the token information on success', fakeAsync(() => {
          scheduler = getTestScheduler();
          componentAsAny.authService.createMachineToken.and.returnValue(createSuccessfulRemoteDataObject$(machineTokenMock));
          scheduler.schedule(() => componentAsAny.processTokenGeneration());
          scheduler.flush();
          expect(component.generatedToken.value).toBe(machineTokenMock.value);
          expect(component.tokenAlreadyExists.value).toBeTrue();
        }));


        it('should show the notification on error', fakeAsync(() => {
          scheduler = getTestScheduler();
          componentAsAny.authService.createMachineToken.and.returnValue(createFailedRemoteDataObject$());
          scheduler.schedule(() => componentAsAny.processTokenGeneration());
          scheduler.flush();
          expect(componentAsAny.notificationService.error).toHaveBeenCalled();
        }));
      });

      describe('and user revoke token', () => {
        it('should show modal before to call processTokenRevocation method', () => {
          spyOn(componentAsAny, 'processTokenRevocation').and.stub();
          spyOn(componentAsAny.modalService, 'open').and.callThrough();
          component.revokeToken();
          expect(componentAsAny.modalService.open).toHaveBeenCalled();
        });

        it('should show the proper info information on success', fakeAsync(() => {
          scheduler = getTestScheduler();
          componentAsAny.authService.deleteMachineToken.and.returnValue(createNoContentRemoteDataObject$());
          scheduler.schedule(() => componentAsAny.processTokenRevocation());
          scheduler.flush();
          expect(component.generatedToken.value).toBeNull();
          expect(component.tokenAlreadyExists.value).toBeFalse();
        }));


        it('should show the notification on error', fakeAsync(() => {
          scheduler = getTestScheduler();
          componentAsAny.authService.deleteMachineToken.and.returnValue(createFailedRemoteDataObject$());
          scheduler.schedule(() => componentAsAny.processTokenRevocation());
          scheduler.flush();
          expect(componentAsAny.notificationService.error).toHaveBeenCalled();
        }));
      });
    });
  });

  describe('when person have generated a new machine token', () => {
    beforeEach(() => {
      component.user = mockEPersonWithToken;
      component.generatedToken.next(machineTokenMock.value);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show token generated properly', () => {
      expect(fixture.debugElement.query(By.css('[data-test="generated"]'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('[data-test="notGenerated"]'))).toBeNull();
      expect(fixture.debugElement.query(By.css('[data-test="tokenGroup"]'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('[data-test="tokenInput"]'))).toBeTruthy();
    });
  });
});
