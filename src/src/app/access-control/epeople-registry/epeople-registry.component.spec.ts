import { CommonModule } from '@angular/common';
import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  BrowserModule,
  By,
} from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  NgbModal,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FindListOptions } from '../../core/data/find-list-options.model';
import {
  buildPaginatedList,
  PaginatedList,
} from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { RequestService } from '../../core/data/request.service';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { PaginationService } from '../../core/pagination/pagination.service';
import { PageInfo } from '../../core/shared/page-info.model';
import { BtnDisabledDirective } from '../../shared/btn-disabled.directive';
import { FormBuilderService } from '../../shared/form/builder/form-builder.service';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { getMockFormBuilderService } from '../../shared/mocks/form-builder-service.mock';
import { RouterMock } from '../../shared/mocks/router.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import {
  EPersonMock,
  EPersonMock2,
} from '../../shared/testing/eperson.mock';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';
import { EPeopleRegistryComponent } from './epeople-registry.component';
import { EPersonFormComponent } from './eperson-form/eperson-form.component';

describe('EPeopleRegistryComponent', () => {
  let component: EPeopleRegistryComponent;
  let fixture: ComponentFixture<EPeopleRegistryComponent>;
  let builderService: FormBuilderService;

  let mockEPeople: EPerson[];
  let ePersonDataServiceStub: any;
  let authorizationService: AuthorizationDataService;
  let modalService: NgbModal;
  let paginationService: PaginationServiceStub;

  beforeEach(waitForAsync(async () => {
    jasmine.getEnv().allowRespy(true);
    mockEPeople = [EPersonMock, EPersonMock2];
    ePersonDataServiceStub = {
      activeEPerson: null,
      allEpeople: mockEPeople,
      getEPeople(): Observable<RemoteData<PaginatedList<EPerson>>> {
        return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo({
          elementsPerPage: this.allEpeople.length,
          totalElements: this.allEpeople.length,
          totalPages: 1,
          currentPage: 1,
        }), this.allEpeople));
      },
      getActiveEPerson(): Observable<EPerson> {
        return of(this.activeEPerson);
      },
      searchByScope(scope: string, query: string, options: FindListOptions = {}): Observable<RemoteData<PaginatedList<EPerson>>> {
        if (scope === 'email') {
          const result = this.allEpeople.find((ePerson: EPerson) => {
            return ePerson.email === query;
          });
          return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo({
            elementsPerPage: [result].length,
            totalElements: [result].length,
            totalPages: 1,
            currentPage: 1,
          }), [result]));
        }
        if (scope === 'metadata') {
          if (query === '') {
            return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo({
              elementsPerPage: this.allEpeople.length,
              totalElements: this.allEpeople.length,
              totalPages: 1,
              currentPage: 1,
            }), this.allEpeople));
          }
          const result = this.allEpeople.find((ePerson: EPerson) => {
            return (ePerson.name.includes(query) || ePerson.email.includes(query));
          });
          return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo({
            elementsPerPage: [result].length,
            totalElements: [result].length,
            totalPages: 1,
            currentPage: 1,
          }), [result]));
        }
        return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo({
          elementsPerPage: this.allEpeople.length,
          totalElements: this.allEpeople.length,
          totalPages: 1,
          currentPage: 1,
        }), this.allEpeople));
      },
      deleteEPerson(ePerson: EPerson): Observable<boolean> {
        this.allEpeople = this.allEpeople.filter((ePerson2: EPerson) => {
          return (ePerson2.uuid !== ePerson.uuid);
        });
        return of(true);
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
      getEPeoplePageRouterLink(): string {
        return '/access-control/epeople';
      },
    };
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true),
    });
    builderService = getMockFormBuilderService();

    paginationService = new PaginationServiceStub();
    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule, RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(), EPeopleRegistryComponent, BtnDisabledDirective],
      providers: [
        { provide: EPersonDataService, useValue: ePersonDataServiceStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: FormBuilderService, useValue: builderService },
        { provide: Router, useValue: new RouterMock() },
        { provide: RequestService, useValue: jasmine.createSpyObj('requestService', ['removeByHrefSubstring']) },
        { provide: PaginationService, useValue: paginationService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(EPeopleRegistryComponent, {
        remove: {
          imports: [
            EPersonFormComponent,
            ThemedLoadingComponent,
            PaginationComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EPeopleRegistryComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    spyOn(modalService, 'open').and.returnValue(Object.assign({ componentInstance: Object.assign({ response: of(true) }) }));
    fixture.detectChanges();
  });

  it('should create EPeopleRegistryComponent', () => {
    expect(component).toBeDefined();
  });

  it('should display list of ePeople', () => {
    const ePeopleIdsFound: DebugElement[] = fixture.debugElement.queryAll(By.css('#epeople tr td:first-child'));
    expect(ePeopleIdsFound.length).toEqual(2);
    mockEPeople.map((ePerson: EPerson) => {
      expect(ePeopleIdsFound.find((foundEl: DebugElement) => {
        return (foundEl.nativeElement.textContent.trim() === ePerson.uuid);
      })).toBeTruthy();
    });
  });

  describe('search', () => {
    describe('when searching with scope/query (scope metadata)', () => {
      let ePeopleIdsFound: DebugElement[];
      beforeEach(fakeAsync(() => {
        component.search({ scope: 'metadata', query: EPersonMock2.name });
        tick();
        fixture.detectChanges();
        ePeopleIdsFound = fixture.debugElement.queryAll(By.css('#epeople tr td:first-child'));
      }));

      it('should display search result', () => {
        expect(ePeopleIdsFound.length).toEqual(1);
        expect(ePeopleIdsFound.find((foundEl: DebugElement) => {
          return (foundEl.nativeElement.textContent.trim() === EPersonMock2.uuid);
        })).toBeTruthy();
      });
    });

    describe('when searching with scope/query (scope email)', () => {
      let ePeopleIdsFound: DebugElement[];
      beforeEach(fakeAsync(() => {
        component.search({ scope: 'email', query: EPersonMock.email });
        tick();
        fixture.detectChanges();
        ePeopleIdsFound = fixture.debugElement.queryAll(By.css('#epeople tr td:first-child'));
      }));

      it('should display search result', () => {
        expect(ePeopleIdsFound.length).toEqual(1);
        expect(ePeopleIdsFound.find((foundEl: DebugElement) => {
          return (foundEl.nativeElement.textContent.trim() === EPersonMock.uuid);
        })).toBeTruthy();
      });
    });
  });

  describe('deleteEPerson', () => {
    describe('when you click on first delete eperson button', () => {
      let ePeopleIdsFoundBeforeDelete;
      let ePeopleIdsFoundAfterDelete;
      beforeEach(fakeAsync(() => {
        ePeopleIdsFoundBeforeDelete = fixture.debugElement.queryAll(By.css('#epeople tr td:first-child'));
        const deleteButtons = fixture.debugElement.queryAll(By.css('.access-control-deleteEPersonButton'));
        deleteButtons[0].triggerEventHandler('click', {
          preventDefault: () => {/**/
          },
        });
        tick();
        fixture.detectChanges();
        ePeopleIdsFoundAfterDelete = fixture.debugElement.queryAll(By.css('#epeople tr td:first-child'));
      }));

      it('first ePerson is deleted', () => {
        expect(ePeopleIdsFoundBeforeDelete.length === ePeopleIdsFoundAfterDelete + 1);
        ePeopleIdsFoundAfterDelete.forEach((epersonElement) => {
          expect(epersonElement !== ePeopleIdsFoundBeforeDelete[0].nativeElement.textContent).toBeTrue();
        });
      });
    });
  });


  it('should hide delete EPerson button when the isAuthorized returns false', () => {
    spyOn(authorizationService, 'isAuthorized').and.returnValue(of(false));
    component.initialisePage();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#epeople tr td div button.delete-button'))).toBeNull();
  });
});
