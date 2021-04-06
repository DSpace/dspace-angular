import { Observable, of as observableOf } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { buildPaginatedList, PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { FindListOptions } from '../../../core/data/request.models';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { PageInfo } from '../../../core/shared/page-info.model';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { EPersonFormComponent } from './eperson-form.component';
import { EPersonMock, EPersonMock2 } from '../../../shared/testing/eperson.mock';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { getMockFormBuilderService } from '../../../shared/mocks/form-builder-service.mock';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthServiceStub } from '../../../shared/testing/auth-service.stub';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { RequestService } from '../../../core/data/request.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';

describe('EPersonFormComponent', () => {
  let component: EPersonFormComponent;
  let fixture: ComponentFixture<EPersonFormComponent>;
  let builderService: FormBuilderService;

  let mockEPeople;
  let ePersonDataServiceStub: any;
  let authService: AuthServiceStub;
  let authorizationService: AuthorizationDataService;
  let groupsDataService: GroupDataService;

  let paginationService;



  beforeEach(waitForAsync(() => {
    mockEPeople = [EPersonMock, EPersonMock2];
    ePersonDataServiceStub = {
      activeEPerson: null,
      allEpeople: mockEPeople,
      getEPeople(): Observable<RemoteData<PaginatedList<EPerson>>> {
        return createSuccessfulRemoteDataObject$(buildPaginatedList(null, this.allEpeople));
      },
      getActiveEPerson(): Observable<EPerson> {
        return observableOf(this.activeEPerson);
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
        return observableOf(true);
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
      }
    };
    builderService = getMockFormBuilderService();
    authService = new AuthServiceStub();
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true)
    });
    groupsDataService = jasmine.createSpyObj('groupsDataService', {
      findAllByHref: createSuccessfulRemoteDataObject$(createPaginatedList([])),
      getGroupRegistryRouterLink: ''
    });

    paginationService = new PaginationServiceStub();
    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [EPersonFormComponent],
      providers: [
        { provide: EPersonDataService, useValue: ePersonDataServiceStub },
        { provide: GroupDataService, useValue: groupsDataService },
        { provide: FormBuilderService, useValue: builderService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: AuthService, useValue: authService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: PaginationService, useValue: paginationService },
        { provide: RequestService, useValue: jasmine.createSpyObj('requestService', ['removeByHrefSubstring']) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EPersonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create EPersonFormComponent', () => {
    expect(component).toBeDefined();
  });

  describe('when submitting the form', () => {
    let firstName;
    let lastName;
    let email;
    let canLogIn;
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
              value: firstName
            }
          ],
          'eperson.lastname': [
            {
              value: lastName
            },
          ],
        },
        email: email,
        canLogIn: canLogIn,
        requireCertificate: requireCertificate,
      });
      spyOn(component.submitForm, 'emit');
      component.firstName.value = firstName;
      component.lastName.value = lastName;
      component.email.value = email;
      component.canLogIn.value = canLogIn;
      component.requireCertificate.value = requireCertificate;
    });
    describe('without active EPerson', () => {
      beforeEach(() => {
        spyOn(ePersonDataServiceStub, 'getActiveEPerson').and.returnValue(observableOf(undefined));
        component.onSubmit();
        fixture.detectChanges();
      });

      it('should emit a new eperson using the correct values', waitForAsync(() => {
        fixture.whenStable().then(() => {
          expect(component.submitForm.emit).toHaveBeenCalledWith(expected);
        });
      }));
    });

    describe('with an active eperson', () => {
      let expectedWithId;

      beforeEach(() => {
        expectedWithId = Object.assign(new EPerson(), {
          id: 'id',
          metadata: {
            'eperson.firstname': [
              {
                value: firstName
              }
            ],
            'eperson.lastname': [
              {
                value: lastName
              },
            ],
          },
          email: email,
          canLogIn: canLogIn,
          requireCertificate: requireCertificate,
          _links: undefined
        });
        spyOn(ePersonDataServiceStub, 'getActiveEPerson').and.returnValue(observableOf(expectedWithId));
        component.onSubmit();
        fixture.detectChanges();
      });

      it('should emit the existing eperson using the correct values', waitForAsync(() => {
        fixture.whenStable().then(() => {
          expect(component.submitForm.emit).toHaveBeenCalledWith(expectedWithId);
        });
      }));
    });
  });

  describe('impersonate', () => {
    let ePersonId;

    beforeEach(() => {
      spyOn(authService, 'impersonate').and.callThrough();
      ePersonId = 'testEPersonId';
      component.epersonInitial = Object.assign(new EPerson(), {
        id: ePersonId
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

    let ePersonId;
    let eperson: EPerson;
    let modalService;

    beforeEach(() => {
      spyOn(authService, 'impersonate').and.callThrough();
      ePersonId = 'testEPersonId';
      eperson = EPersonMock;
      component.epersonInitial = eperson;
      component.canDelete$ = observableOf(true);
      spyOn(component.epersonService, 'getActiveEPerson').and.returnValue(observableOf(eperson));
      modalService = (component as any).modalService;
      spyOn(modalService, 'open').and.returnValue(Object.assign({ componentInstance: Object.assign({ response: observableOf(true) }) }));
      fixture.detectChanges();

    });

    it('the delete button should be active if the eperson can be deleted', () => {
      const deleteButton = fixture.debugElement.query(By.css('.delete-button'));
      expect(deleteButton.nativeElement.disabled).toBe(false);
    });

    it('the delete button should be disabled if the eperson cannot be deleted', () => {
      component.canDelete$ = observableOf(false);
      fixture.detectChanges();
      const deleteButton = fixture.debugElement.query(By.css('.delete-button'));
      expect(deleteButton.nativeElement.disabled).toBe(true);
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
      expect(deleteButton.nativeElement.disabled).toBe(false);
      deleteButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.epersonService.deleteEPerson).toHaveBeenCalledWith(eperson);
    });
  });
});
