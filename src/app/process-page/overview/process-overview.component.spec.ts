import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf, of } from 'rxjs';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { NotificationsServiceStub } from 'src/app/shared/testing/notifications-service.stub';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { ProcessDataService } from '../../core/data/processes/process-data.service';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { PaginationService } from '../../core/pagination/pagination.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { DatePipe } from '@angular/common';
import { VarDirective } from '../../shared/utils/var.directive';
import { ProcessStatus } from '../processes/process-status.model';
import { Process } from '../processes/process.model';
import { ProcessOverviewComponent } from './process-overview.component';

describe('ProcessOverviewComponent', () => {
  let component: ProcessOverviewComponent;
  let fixture: ComponentFixture<ProcessOverviewComponent>;

  let processService: ProcessDataService;
  let ePersonService: EPersonDataService;
  let authorizationService: any;
  let paginationService;

  let adminProcesses: Process[];
  let noAdminProcesses: Process[];
  let ePerson: EPerson;

  const pipe = new DatePipe('en-US');

  function init() {
    adminProcesses = [
      Object.assign(new Process(), {
        processId: 1,
        scriptName: 'script-name',
        startTime: '2020-03-19 00:30:00',
        endTime: '2020-03-19 23:30:00',
        processStatus: ProcessStatus.COMPLETED
      }),
      Object.assign(new Process(), {
        processId: 2,
        scriptName: 'script-name',
        startTime: '2020-03-20 00:30:00',
        endTime: '2020-03-20 23:30:00',
        processStatus: ProcessStatus.FAILED
      }),
      Object.assign(new Process(), {
        processId: 3,
        scriptName: 'another-script-name',
        startTime: '2020-03-21 00:30:00',
        endTime: '2020-03-21 23:30:00',
        processStatus: ProcessStatus.RUNNING
      })
    ];
    noAdminProcesses = [
      Object.assign(new Process(), {
        processId: 4,
        scriptName: 'script-name',
        startTime: '2020-03-19',
        endTime: '2020-03-19',
        processStatus: ProcessStatus.COMPLETED
      }),
      Object.assign(new Process(), {
        processId: 5,
        scriptName: 'another-script-name',
        startTime: '2020-03-21',
        endTime: '2020-03-21',
        processStatus: ProcessStatus.RUNNING
      })
    ];
    ePerson = Object.assign(new EPerson(), {
      metadata: {
        'eperson.firstname': [
          {
            value: 'John',
            language: null
          }
        ],
        'eperson.lastname': [
          {
            value: 'Doe',
            language: null
          }
        ]
      }
    });
    processService = jasmine.createSpyObj('processService', {
      findAll: createSuccessfulRemoteDataObject$(createPaginatedList(adminProcesses)),
      searchBy: createSuccessfulRemoteDataObject$(createPaginatedList(noAdminProcesses)),
      delete: createSuccessfulRemoteDataObject$(null),
      setStale: observableOf(true)
    });
    ePersonService = jasmine.createSpyObj('ePersonService', {
      findById: createSuccessfulRemoteDataObject$(ePerson)
    });
    authorizationService = jasmine.createSpyObj('authorizationService', ['isAuthorized']);

    paginationService = new PaginationServiceStub();
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [ProcessOverviewComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ProcessDataService, useValue: processService },
        { provide: EPersonDataService, useValue: ePersonService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: PaginationService, useValue: paginationService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  describe('if the current user is an admin', () => {

    beforeEach(() => {

      authorizationService.isAuthorized.and.callFake(() => of(true));

      fixture = TestBed.createComponent(ProcessOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    describe('table structure', () => {
      let rowElements;

      beforeEach(() => {
        rowElements = fixture.debugElement.queryAll(By.css('tbody tr'));
      });

      it(`should contain 3 rows`, () => {
        expect(rowElements.length).toEqual(3);
      });

      it('should display the process IDs in the first column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(1)')).nativeElement;
          expect(el.textContent).toContain(adminProcesses[index].processId);
        });
      });

      it('should display the script names in the second column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(2)')).nativeElement;
          expect(el.textContent).toContain(adminProcesses[index].scriptName);
        });
      });

      it('should display the eperson\'s name in the third column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(3)')).nativeElement;
          expect(el.textContent).toContain(ePerson.name);
        });
      });

      it('should display the start time in the fourth column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(4)')).nativeElement;
        expect(el.textContent).toContain(pipe.transform(adminProcesses[index].startTime, component.dateFormat, 'UTC'));
        });
      });

      it('should display the end time in the fifth column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(5)')).nativeElement;
        expect(el.textContent).toContain(pipe.transform(adminProcesses[index].endTime, component.dateFormat, 'UTC'));
        });
      });

      it('should display the status in the sixth column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(6)')).nativeElement;
          expect(el.textContent).toContain(adminProcesses[index].processStatus);
        });
      });

      it('should delete the selected process if the related button is clicked', fakeAsync(() => {
        component.delete(adminProcesses[0]);
        tick();
        expect(processService.delete).toHaveBeenCalledWith(adminProcesses[0].processId);
      }));

    });

  });

  describe('if the current user is not an admin', () => {

    beforeEach(() => {

      authorizationService.isAuthorized.and.callFake(() => of(false));

      fixture = TestBed.createComponent(ProcessOverviewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    describe('table structure', () => {
      let rowElements;

      beforeEach(() => {
        rowElements = fixture.debugElement.queryAll(By.css('tbody tr'));
      });

      it(`should contain 2 rows`, () => {
        expect(rowElements.length).toEqual(2);
      });

      it('should display the process IDs in the first column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(1)')).nativeElement;
          expect(el.textContent).toContain(noAdminProcesses[index].processId);
        });
      });

      it('should display the script names in the second column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(2)')).nativeElement;
          expect(el.textContent).toContain(noAdminProcesses[index].scriptName);
        });
      });

      it('should display the eperson\'s name in the third column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(3)')).nativeElement;
          expect(el.textContent).toContain(ePerson.name);
        });
      });

      it('should display the start time in the fourth column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(4)')).nativeElement;
          expect(el.textContent).toContain(pipe.transform(noAdminProcesses[index].startTime, component.dateFormat, 'UTC'));
        });
      });

      it('should display the end time in the fifth column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(5)')).nativeElement;
          expect(el.textContent).toContain(pipe.transform(noAdminProcesses[index].endTime, component.dateFormat, 'UTC'));
        });
      });

      it('should display the status in the sixth column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(6)')).nativeElement;
          expect(el.textContent).toContain(noAdminProcesses[index].processStatus);
        });
      });

      it('should delete the selected process if the related button is clicked', fakeAsync(() => {
        component.delete(noAdminProcesses[0]);
        tick();
        expect(processService.delete).toHaveBeenCalledWith(noAdminProcesses[0].processId);
      }));

    });
  });
});
