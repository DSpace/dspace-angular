import { of as observableOf } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { RestResponse } from '../../../../core/cache/response.models';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RemoteData } from '../../../../core/data/remote-data';
import { FindListOptions } from '../../../../core/data/request.models';
import { EPersonDataService } from '../../../../core/eperson/eperson-data.service';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { getMockFormBuilderService } from '../../../../shared/mocks/mock-form-builder-service';
import { getMockTranslateService } from '../../../../shared/mocks/mock-translate.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { EPersonMock, EPersonMock2 } from '../../../../shared/testing/eperson-mock';
import { MockTranslateLoader } from '../../../../shared/testing/mock-translate-loader';
import { NotificationsServiceStub } from '../../../../shared/testing/notifications-service-stub';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/testing/utils';
import { EPeopleRegistryComponent } from '../epeople-registry.component';
import { EPersonFormComponent } from './eperson-form.component';

describe('EPersonFormComponent', () => {
  let component: EPersonFormComponent;
  let fixture: ComponentFixture<EPersonFormComponent>;
  let translateService: TranslateService;
  let builderService: FormBuilderService;

  const mockEPeople = [EPersonMock, EPersonMock2];
  let ePersonDataServiceStub: any;

  beforeEach(async(() => {
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
    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        }),
      ],
      declarations: [EPeopleRegistryComponent, EPersonFormComponent],
      providers: [EPersonFormComponent,
        { provide: EPersonDataService, useValue: ePersonDataServiceStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: FormBuilderService, useValue: builderService },
        EPeopleRegistryComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EPersonFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create EPersonFormComponent', inject([EPersonFormComponent], (comp: EPersonFormComponent) => {
    expect(comp).toBeDefined();
  }));

  describe('when submitting the form', () => {
    const firstName = 'testName';
    const lastName = 'testLastName';
    const email = 'testEmail@test.com';
    const canLogIn = false;
    const requireCertificate = false;

    const expected = Object.assign(new EPerson(), {
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
    beforeEach(() => {
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
      const expectedWithId = Object.assign(new EPerson(), {
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

      beforeEach(() => {
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

});
