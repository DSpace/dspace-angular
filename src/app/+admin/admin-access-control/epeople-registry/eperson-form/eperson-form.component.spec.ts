import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../../core/cache/object-cache.service';
import { RestResponse } from '../../../../core/cache/response.models';
import { DSOChangeAnalyzer } from '../../../../core/data/dso-change-analyzer.service';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RemoteData } from '../../../../core/data/remote-data';
import { FindListOptions } from '../../../../core/data/request.models';
import { EPersonDataService } from '../../../../core/eperson/eperson-data.service';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { UUIDService } from '../../../../core/shared/uuid.service';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { EPeopleRegistryComponent } from '../epeople-registry.component';
import { EPersonFormComponent } from './eperson-form.component';
import { EPersonMock, EPersonMock2 } from '../../../../shared/testing/eperson.mock';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { getMockFormBuilderService } from '../../../../shared/mocks/form-builder-service.mock';
import { getMockTranslateService } from '../../../../shared/mocks/translate.service.mock';
import { NotificationsServiceStub } from '../../../../shared/testing/notifications-service.stub';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthServiceStub } from '../../../../shared/testing/auth-service.stub';

describe('EPersonFormComponent', () => {
  let component: EPersonFormComponent;
  let fixture: ComponentFixture<EPersonFormComponent>;
  let translateService: TranslateService;
  let builderService: FormBuilderService;

  let mockEPeople;
  let ePersonDataServiceStub: any;
  let authService: AuthServiceStub;

  beforeEach(async(() => {
    mockEPeople = [EPersonMock, EPersonMock2];
    ePersonDataServiceStub = {
      activeEPerson: null,
      allEpeople: mockEPeople,
      getEPeople(): Observable<RemoteData<PaginatedList<EPerson>>> {
        return createSuccessfulRemoteDataObject$(new PaginatedList(null, this.allEpeople));
      },
      getActiveEPerson(): Observable<EPerson> {
        return observableOf(this.activeEPerson);
      },
      searchByScope(scope: string, query: string, options: FindListOptions = {}): Observable<RemoteData<PaginatedList<EPerson>>> {
        if (scope === 'email') {
          const result = this.allEpeople.find((ePerson: EPerson) => {
            return ePerson.email === query
          });
          return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [result]));
        }
        if (scope === 'metadata') {
          if (query === '') {
            return createSuccessfulRemoteDataObject$(new PaginatedList(null, this.allEpeople));
          }
          const result = this.allEpeople.find((ePerson: EPerson) => {
            return (ePerson.name.includes(query) || ePerson.email.includes(query))
          });
          return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [result]));
        }
        return createSuccessfulRemoteDataObject$(new PaginatedList(null, this.allEpeople));
      },
      deleteEPerson(ePerson: EPerson): Observable<boolean> {
        this.allEpeople = this.allEpeople.filter((ePerson2: EPerson) => {
          return (ePerson2.uuid !== ePerson.uuid);
        });
        return observableOf(true);
      },
      create(ePerson: EPerson) {
        this.allEpeople = [...this.allEpeople, ePerson]
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
      tryToCreate(ePerson: EPerson): Observable<RestResponse> {
        this.allEpeople = [...this.allEpeople, ePerson]
        return observableOf(new RestResponse(true, 200, 'Success'));
      },
      updateEPerson(ePerson: EPerson): Observable<RestResponse> {
        this.allEpeople.forEach((ePersonInList: EPerson, i: number) => {
          if (ePersonInList.id === ePerson.id) {
            this.allEpeople[i] = ePerson;
          }
        });
        return observableOf(new RestResponse(true, 200, 'Success'));

      }
    };
    builderService = getMockFormBuilderService();
    translateService = getMockTranslateService();
    authService = new AuthServiceStub();
    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [EPeopleRegistryComponent, EPersonFormComponent],
      providers: [EPersonFormComponent,
        { provide: EPersonDataService, useValue: ePersonDataServiceStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: FormBuilderService, useValue: builderService },
        { provide: DSOChangeAnalyzer, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: ObjectCacheService, useValue: {} },
        { provide: UUIDService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: HALEndpointService, useValue: {} },
        { provide: AuthService, useValue: authService },
        EPeopleRegistryComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EPersonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create EPersonFormComponent', inject([EPersonFormComponent], (comp: EPersonFormComponent) => {
    expect(comp).toBeDefined();
  }));

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

      it('should emit a new eperson using the correct values', async(() => {
        fixture.whenStable().then(() => {
          expect(component.submitForm.emit).toHaveBeenCalledWith(expected);
        });
      }));
    });

    describe('with an active eperson', () => {
      let expectedWithId;

      beforeEach(() => {
        expectedWithId = Object.assign(new EPerson(), {
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
        spyOn(ePersonDataServiceStub, 'getActiveEPerson').and.returnValue(observableOf(expectedWithId));
        component.onSubmit();
        fixture.detectChanges();
      });

      it('should emit the existing eperson using the correct values', async(() => {
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

});
