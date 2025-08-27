import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  BrowserModule,
  By,
} from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
  RouterModule,
} from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';
import { EpersonRegistrationService } from '../../../core/data/eperson-registration.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import {
  buildPaginatedList,
  PaginatedList,
} from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { RequestService } from '../../../core/data/request.service';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { PageInfo } from '../../../core/shared/page-info.model';
import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../../shared/form/form.component';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { getMockFormBuilderService } from '../../../shared/mocks/form-builder-service.mock';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';
import { AuthServiceStub } from '../../../shared/testing/auth-service.stub';
import {
  EPersonMock,
  EPersonMock2,
} from '../../../shared/testing/eperson.mock';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { RouterStub } from '../../../shared/testing/router.stub';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { HasNoValuePipe } from '../../../shared/utils/has-no-value.pipe';
import { EPeopleRegistryComponent } from '../epeople-registry.component';
import { EPersonFormComponent } from './eperson-form.component';
import { ValidateEmailNotTaken } from './validators/email-taken.validator';

describe('EPersonFormComponent', () => {
  let component: EPersonFormComponent;
  let fixture: ComponentFixture<EPersonFormComponent>;
  let builderService: FormBuilderService;

  let mockEPeople;
  let ePersonDataServiceStub: any;
  let authService: AuthServiceStub;
  let authorizationService: AuthorizationDataService;
  let groupsDataService: GroupDataService;
  let epersonRegistrationService: EpersonRegistrationService;
  let route: ActivatedRouteStub;
  let router: RouterStub;

  let paginationService;



  beforeEach(waitForAsync(() => {
    mockEPeople = [EPersonMock, EPersonMock2];
    ePersonDataServiceStub = {
      activeEPerson: null,
      allEpeople: mockEPeople,
      getActiveEPerson(): Observable<EPerson> {
        return of(this.activeEPerson);
      },
      searchByScope(scope: string, query: string, options: FindListOptions = {}): Observable<RemoteData<PaginatedList<EPerson>>> {
        if (scope === 'email') {
          const result = this.allEpeople.find((ePerson: EPerson) => {
            return ePerson.email === query;
          });
          return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [result]));
        }
        if (scope === 'metadata') {
          if (query === '') {
            return createSuccessfulRemoteDataObject$(buildPaginatedList(null, this.allEpeople));
          }
          const result = this.allEpeople.find((ePerson: EPerson) => {
            return (ePerson.name.includes(query) || ePerson.email.includes(query));
          });
          return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [result]));
        }
        return createSuccessfulRemoteDataObject$(buildPaginatedList(null, this.allEpeople));
      },
      deleteEPerson(ePerson: EPerson): Observable<boolean> {
        this.allEpeople = this.allEpeople.filter((ePerson2: EPerson) => {
          return (ePerson2.uuid !== ePerson.uuid);
        });
        return of(true);
      },
      create(ePerson: EPerson): Observable<RemoteData<EPerson>> {
        this.allEpeople = [...this.allEpeople, ePerson];
        return createSuccessfulRemoteDataObject$(ePerson);
      },
      editEPerson(ePerson: EPerson) {
        this.activeEPerson = ePerson;
      },
      cancelEditEPerson() {
        this.activeEPerson = null;
      },
      clearEPersonRequests(): void {
        // empty
      },
      updateEPerson(ePerson: EPerson): Observable<RemoteData<EPerson>> {
        this.allEpeople.forEach((ePersonInList: EPerson, i: number) => {
          if (ePersonInList.id === ePerson.id) {
            this.allEpeople[i] = ePerson;
          }
        });
        return createSuccessfulRemoteDataObject$(ePerson);
      },
      getEPersonByEmail(email): Observable<RemoteData<EPerson>> {
        return createSuccessfulRemoteDataObject$(null);
      },
      findById(_id: string, _useCachedVersionIfAvailable = true, _reRequestOnStale = true, ..._linksToFollow: FollowLinkConfig<EPerson>[]): Observable<RemoteData<EPerson>> {
        return createSuccessfulRemoteDataObject$(null);
      },
    };
    builderService = Object.assign(getMockFormBuilderService(),{
      createFormGroup(formModel, options = null) {
        const controls = {};
        formModel.forEach( model => {
          model.parent = parent;
          const controlModel = model;
          const controlState = { value: controlModel.value, disabled: controlModel.disabled };
          const controlOptions = this.createAbstractControlOptions(controlModel.validators, controlModel.asyncValidators, controlModel.updateOn);
          controls[model.id] = new UntypedFormControl(controlState, controlOptions);
        });
        return new UntypedFormGroup(controls, options);
      },
      createAbstractControlOptions(validatorsConfig = null, asyncValidatorsConfig = null, updateOn = null) {
        return {
          validators: validatorsConfig !== null ? this.getValidators(validatorsConfig) : null,
        };
      },
      getValidators(validatorsConfig) {
        return this.getValidatorFns(validatorsConfig);
      },
      getValidatorFns(validatorsConfig, validatorsToken = this._NG_VALIDATORS) {
        let validatorFns = [];
        if (this.isObject(validatorsConfig)) {
          validatorFns = Object.keys(validatorsConfig).map(validatorConfigKey => {
            const validatorConfigValue = validatorsConfig[validatorConfigKey];
            if (this.isValidatorDescriptor(validatorConfigValue)) {
              const descriptor = validatorConfigValue;
              return this.getValidatorFn(descriptor.name, descriptor.args, validatorsToken);
            }
            return this.getValidatorFn(validatorConfigKey, validatorConfigValue, validatorsToken);
          });
        }
        return validatorFns;
      },
      getValidatorFn(validatorName, validatorArgs = null, validatorsToken = this._NG_VALIDATORS) {
        let validatorFn;
        if (Validators.hasOwnProperty(validatorName)) { // Built-in Angular Validators
          validatorFn = Validators[validatorName];
        } else { // Custom Validators
          if (this._DYNAMIC_VALIDATORS && this._DYNAMIC_VALIDATORS.has(validatorName)) {
            validatorFn = this._DYNAMIC_VALIDATORS.get(validatorName);
          } else if (validatorsToken) {
            validatorFn = validatorsToken.find(validator => validator.name === validatorName);
          }
        }
        if (validatorFn === undefined) { // throw when no validator could be resolved
          throw new Error(`validator '${validatorName}' is not provided via NG_VALIDATORS, NG_ASYNC_VALIDATORS or DYNAMIC_FORM_VALIDATORS`);
        }
        if (validatorArgs !== null) {
          return validatorFn(validatorArgs);
        }
        return validatorFn;
      },
      isValidatorDescriptor(value) {
        if (this.isObject(value)) {
          return value.hasOwnProperty('name') && value.hasOwnProperty('args');
        }
        return false;
      },
      isObject(value) {
        return typeof value === 'object' && value !== null;
      },
    });
    authService = new AuthServiceStub();
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true),

    });
    groupsDataService = jasmine.createSpyObj('groupsDataService', {
      findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList([])),
      getGroupRegistryRouterLink: '',
    });

    paginationService = new PaginationServiceStub();
    route = new ActivatedRouteStub();
    router = new RouterStub();
    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BtnDisabledDirective, BrowserModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        EPersonFormComponent,
        HasNoValuePipe,
      ],
      providers: [
        { provide: EPersonDataService, useValue: ePersonDataServiceStub },
        { provide: GroupDataService, useValue: groupsDataService },
        { provide: FormBuilderService, useValue: builderService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: AuthService, useValue: authService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: PaginationService, useValue: paginationService },
        { provide: RequestService, useValue: jasmine.createSpyObj('requestService', ['removeByHrefSubstring']) },
        { provide: EpersonRegistrationService, useValue: epersonRegistrationService },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: router },
        EPeopleRegistryComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(EPersonFormComponent, {
        remove: { imports: [    ThemedLoadingComponent, PaginationComponent,FormComponent] },
      })
      .compileComponents();
  }));

  epersonRegistrationService = jasmine.createSpyObj('epersonRegistrationService', {
    registerEmail: createSuccessfulRemoteDataObject$(null),
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EPersonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create EPersonFormComponent', () => {
    expect(component).toBeDefined();
  });

  describe('check form validation', () => {
    let canLogIn: boolean;
    let requireCertificate: boolean;

    beforeEach(() => {
      canLogIn = false;
      requireCertificate = false;

      spyOn(component.submitForm, 'emit');
      component.canLogIn.value = canLogIn;
      component.requireCertificate.value = requireCertificate;

      fixture.detectChanges();
      component.initialisePage();
      fixture.detectChanges();
    });
    describe('firstName, lastName and email should be required', () => {
      it('form should be invalid because the firstName is required', () => {
        expect(component.formGroup.controls.firstName.valid).toBeFalse();
        expect(component.formGroup.controls.firstName.errors.required).toBeTrue();
      });
      it('form should be invalid because the lastName is required', () => {
        expect(component.formGroup.controls.lastName.valid).toBeFalse();
        expect(component.formGroup.controls.lastName.errors.required).toBeTrue();
      });
      it('form should be invalid because the email is required', () => {
        expect(component.formGroup.controls.email.valid).toBeFalse();
        expect(component.formGroup.controls.email.errors.required).toBeTrue();
      });
    });

    describe('after inserting information firstName,lastName and email not required', () => {
      beforeEach(() => {
        component.formGroup.controls.firstName.setValue('test');
        component.formGroup.controls.lastName.setValue('test');
        component.formGroup.controls.email.setValue('test@test.com');
        fixture.detectChanges();
      });
      it('firstName should be valid because the firstName is set', () => {
        expect(component.formGroup.controls.firstName.valid).toBeTrue();
        expect(component.formGroup.controls.firstName.errors).toBeNull();
      });
      it('lastName should be valid because the lastName is set', () => {
        expect(component.formGroup.controls.lastName.valid).toBeTrue();
        expect(component.formGroup.controls.lastName.errors).toBeNull();
      });
      it('email should be valid because the email is set', () => {
        expect(component.formGroup.controls.email.valid).toBeTrue();
        expect(component.formGroup.controls.email.errors).toBeNull();
      });
    });


    describe('after inserting email wrong should show pattern validation error', () => {
      beforeEach(() => {
        component.formGroup.controls.email.setValue('test@test');
        fixture.detectChanges();
      });
      it('email should not be valid because the email pattern', () => {
        expect(component.formGroup.controls.email.valid).toBeFalse();
        expect(component.formGroup.controls.email.errors.pattern).toBeTruthy();
      });
    });

    describe('after already utilized email', () => {
      beforeEach(() => {
        const ePersonServiceWithEperson = Object.assign(ePersonDataServiceStub,{
          getEPersonByEmail(): Observable<RemoteData<EPerson>> {
            return createSuccessfulRemoteDataObject$(EPersonMock);
          },
        });
        component.formGroup.controls.email.setValue('test@test.com');
        component.formGroup.controls.email.setAsyncValidators(ValidateEmailNotTaken.createValidator(ePersonServiceWithEperson));
        fixture.detectChanges();
      });

      it('email should not be valid because email is already taken', () => {
        expect(component.formGroup.controls.email.valid).toBeFalse();
        expect(component.formGroup.controls.email.errors.emailTaken).toBeTruthy();
      });
    });
  });

  describe('when submitting the form', () => {
    let firstName;
    let lastName;
    let email;
    let canLogIn: boolean;
    let requireCertificate;

    let expected;
    beforeEach(() => {
      firstName = 'testName';
      lastName = 'testLastName';
      email = 'testEmail@test.com';
      canLogIn = false;
      requireCertificate = false;

      expected = Object.assign(new EPerson(), {
        metadata: {
          'eperson.firstname': [
            {
              value: firstName,
            },
          ],
          'eperson.lastname': [
            {
              value: lastName,
            },
          ],
        },
        email: email,
        canLogIn: canLogIn,
        requireCertificate: requireCertificate,
      });
      spyOn(component.submitForm, 'emit');
      component.ngOnInit();
      component.firstName.value = firstName;
      component.lastName.value = lastName;
      component.email.value = email;
      component.canLogIn.value = canLogIn;
      component.requireCertificate.value = requireCertificate;
    });
    describe('without active EPerson', () => {
      beforeEach(() => {
        spyOn(ePersonDataServiceStub, 'getActiveEPerson').and.returnValue(of(undefined));
        component.onSubmit();
        fixture.detectChanges();
      });

      it('should emit a new eperson using the correct values', () => {
        expect(component.submitForm.emit).toHaveBeenCalledWith(expected);
      });
    });

    describe('with an active eperson', () => {
      let expectedWithId;

      beforeEach(() => {
        expectedWithId = Object.assign(new EPerson(), {
          id: 'id',
          metadata: {
            'eperson.firstname': [
              {
                value: firstName,
              },
            ],
            'eperson.lastname': [
              {
                value: lastName,
              },
            ],
          },
          email: email,
          canLogIn: canLogIn,
          requireCertificate: requireCertificate,
          _links: {
            groups: {
              href: '',
            },
            self: {
              href: '',
            },
          },
        });
        spyOn(ePersonDataServiceStub, 'getActiveEPerson').and.returnValue(of(expectedWithId));
        component.ngOnInit();
        component.onSubmit();
        fixture.detectChanges();
      });

      it('should emit the existing eperson using the correct values', () => {
        expect(component.submitForm.emit).toHaveBeenCalledWith(expectedWithId);
      });
    });
  });

  describe('impersonate', () => {
    let ePersonId;

    beforeEach(() => {
      spyOn(authService, 'impersonate').and.callThrough();
      ePersonId = 'testEPersonId';
      component.epersonInitial = Object.assign(new EPerson(), {
        id: ePersonId,
      });
      component.impersonate();
    });

    it('should call authService.impersonate', () => {
      expect(authService.impersonate).toHaveBeenCalledWith(ePersonId);
    });

    it('should set isImpersonated to true', () => {
      expect(component.isImpersonated).toBe(true);
    });
  });

  describe('stopImpersonating', () => {
    beforeEach(() => {
      spyOn(authService, 'stopImpersonatingAndRefresh').and.callThrough();
      component.stopImpersonating();
    });

    it('should call authService.stopImpersonatingAndRefresh', () => {
      expect(authService.stopImpersonatingAndRefresh).toHaveBeenCalled();
    });

    it('should set isImpersonated to false', () => {
      expect(component.isImpersonated).toBe(false);
    });
  });

  describe('delete', () => {
    let eperson: EPerson;
    let modalService;

    beforeEach(() => {
      spyOn(authService, 'impersonate').and.callThrough();
      eperson = EPersonMock;
      component.epersonInitial = eperson;
      component.canDelete$ = of(true);
      spyOn(component.epersonService, 'getActiveEPerson').and.returnValue(of(eperson));
      modalService = (component as any).modalService;
      spyOn(modalService, 'open').and.returnValue(Object.assign({ componentInstance: Object.assign({ response: of(true) }) }));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('the delete button should be visible if the ePerson can be deleted', () => {
      const deleteButton = fixture.debugElement.query(By.css('.delete-button'));
      expect(deleteButton).not.toBeNull();
    });

    it('the delete button should be hidden if the ePerson cannot be deleted', () => {
      component.canDelete$ = of(false);
      fixture.detectChanges();
      const deleteButton = fixture.debugElement.query(By.css('.delete-button'));
      expect(deleteButton).toBeNull();
    });

    it('should call the epersonFormComponent delete when clicked on the button', () => {
      spyOn(component, 'delete').and.stub();
      spyOn(component.epersonService, 'deleteEPerson').and.returnValue(createSuccessfulRemoteDataObject$('No Content', 204));
      const deleteButton = fixture.debugElement.query(By.css('.delete-button'));
      deleteButton.triggerEventHandler('click', null);
      expect(component.delete).toHaveBeenCalled();
    });

    it('should call the epersonService delete when clicked on the button', () => {
      // ePersonDataServiceStub.activeEPerson = eperson;
      spyOn(component.epersonService, 'deleteEPerson').and.returnValue(createSuccessfulRemoteDataObject$('No Content', 204));
      const deleteButton = fixture.debugElement.query(By.css('.delete-button'));
      expect(deleteButton.nativeElement.getAttribute('aria-disabled')).toBeNull();
      expect(deleteButton.nativeElement.classList.contains('disabled')).toBeFalse();
      deleteButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.epersonService.deleteEPerson).toHaveBeenCalledWith(eperson);
    });
  });

  describe('Reset Password', () => {
    let ePersonId;
    let ePersonEmail;

    beforeEach(() => {
      ePersonId = 'testEPersonId';
      ePersonEmail = 'person.email@4science.it';
      component.epersonInitial = Object.assign(new EPerson(), {
        id: ePersonId,
        email: ePersonEmail,
      });
      component.resetPassword();
    });

    it('should call epersonRegistrationService.registerEmail', () => {
      expect(epersonRegistrationService.registerEmail).toHaveBeenCalledWith(ePersonEmail, null, 'forgot');
    });
  });
});
