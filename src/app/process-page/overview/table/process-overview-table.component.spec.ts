import { ProcessOverviewTableComponent } from './process-overview-table.component';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { ProcessDataService } from '../../../core/data/processes/process-data.service';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';
import { Process } from '../../processes/process.model';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { ProcessBulkDeleteService } from '../process-bulk-delete.service';
import { ProcessStatus } from '../../processes/process-status.model';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { BehaviorSubject } from 'rxjs';
import { NgbModal, NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { VarDirective } from '../../../shared/utils/var.directive';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { By } from '@angular/platform-browser';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthServiceMock } from '../../../shared/mocks/auth.service.mock';
import { RouteService } from '../../../core/services/route.service';
import { routeServiceStub } from '../../../shared/testing/route-service.stub';
import { ProcessOverviewService } from '../process-overview.service';
import { take } from 'rxjs/operators';


describe('ProcessOverviewTableComponent', () => {
  let component: ProcessOverviewTableComponent;
  let fixture: ComponentFixture<ProcessOverviewTableComponent>;

  let processOverviewService: ProcessOverviewService;
  let processService: ProcessDataService;
  let ePersonService: EPersonDataService;
  let paginationService; // : PaginationService; Not typed as the stub does not fully implement PaginationService
  let processBulkDeleteService: ProcessBulkDeleteService;
  let modalService: NgbModal;
  let authService; // : AuthService; Not typed as the mock does not fully implement AuthService
  let routeService: RouteService;

  let processes: Process[];
  let ePerson: EPerson;

  function init() {
    processes = [
      Object.assign(new Process(), {
        processId: 1,
        scriptName: 'script-a',
        startTime: '2020-03-19 00:30:00',
        endTime: '2020-03-19 23:30:00',
        processStatus: ProcessStatus.COMPLETED
      }),
      Object.assign(new Process(), {
        processId: 2,
        scriptName: 'script-b',
        startTime: '2020-03-20 00:30:00',
        endTime: '2020-03-20 23:30:00',
        processStatus: ProcessStatus.FAILED
      }),
      Object.assign(new Process(), {
        processId: 3,
        scriptName: 'script-c',
        startTime: '2020-03-21 00:30:00',
        endTime: '2020-03-21 23:30:00',
        processStatus: ProcessStatus.RUNNING
      }),
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
    processOverviewService = jasmine.createSpyObj('processOverviewService', {
      getFindListOptions: {
        currentPage: 1,
        elementsPerPage: 5,
        sort: 'creationTime'
      },
      getProcessesByProcessStatus: createSuccessfulRemoteDataObject$(createPaginatedList(processes)).pipe(take(1))
    });
    processService = jasmine.createSpyObj('processService', {
      searchBy: createSuccessfulRemoteDataObject$(createPaginatedList(processes)).pipe(take(1))
    });
    ePersonService = jasmine.createSpyObj('ePersonService', {
      findById: createSuccessfulRemoteDataObject$(ePerson)
    });

    paginationService = new PaginationServiceStub();

    processBulkDeleteService = jasmine.createSpyObj('processBulkDeleteService', {
      clearAllProcesses: {},
      deleteSelectedProcesses: {},
      isProcessing$: new BehaviorSubject(false),
      hasSelected: true,
      isToBeDeleted: true,
      toggleDelete: {},
      getAmountOfSelectedProcesses: 5

    });

    (processBulkDeleteService.isToBeDeleted as jasmine.Spy).and.callFake((id) => {
      return id === 2;
    });

    modalService = jasmine.createSpyObj('modalService', {
      open: {}
    });

    authService = new AuthServiceMock();
    routeService = routeServiceStub;
  }

  beforeEach(waitForAsync(() => {
    init();

    void TestBed.configureTestingModule({
      declarations: [ProcessOverviewTableComponent, VarDirective, NgbCollapse],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ProcessOverviewService, useValue: processOverviewService },
        { provide: ProcessDataService, useValue: processService },
        { provide: EPersonDataService, useValue: ePersonService },
        { provide: PaginationService, useValue: paginationService },
        { provide: ProcessBulkDeleteService, useValue: processBulkDeleteService },
        { provide: NgbModal, useValue: modalService },
        { provide: AuthService, useValue: authService },
        { provide: RouteService, useValue: routeService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessOverviewTableComponent);
    component = fixture.componentInstance;
    component.getInfoValueMethod = (_process: Process) => 'process info';
    component.processStatus = ProcessStatus.COMPLETED;
    fixture.detectChanges();
  });

  describe('table structure', () => {
    let rowElements;

    beforeEach(() => {
      rowElements = fixture.debugElement.queryAll(By.css('tbody tr'));
    });

    it('should contain 3 rows', () => {
      expect(rowElements.length).toEqual(3);
    });

    it('should display the process\' ID in the first column', () => {
      rowElements.forEach((rowElement, index) => {
        const el = rowElement.query(By.css('td:nth-child(1)')).nativeElement;
        expect(el.textContent).toContain(processes[index].processId);
      });
    });

    it('should display the scripts name in the second column', () => {
      rowElements.forEach((rowElement, index) => {
        const el = rowElement.query(By.css('td:nth-child(2)')).nativeElement;
        expect(el.textContent).toContain(processes[index].scriptName);
      });
    });

    it('should display the eperson\'s name in the third column', () => {
      rowElements.forEach((rowElement, _index) => {
        const el = rowElement.query(By.css('td:nth-child(3)')).nativeElement;
        expect(el.textContent).toContain(ePerson.name);
      });
    });

    it('should display the requested info in the fourth column', () => {
      rowElements.forEach((rowElement, _index) => {
        const el = rowElement.query(By.css('td:nth-child(4)')).nativeElement;
        expect(el.textContent).toContain('process info');
      });
    });

    it('should display a delete button in the fifth column', () => {
      rowElements.forEach((rowElement, index) => {
       const el = rowElement.query(By.css('td:nth-child(5)'));
       expect(el.nativeElement.innerHTML).toContain('fas fa-trash');

       el.query(By.css('button')).triggerEventHandler('click', null);
       expect(processBulkDeleteService.toggleDelete).toHaveBeenCalledWith(processes[index].processId);
      });
    });

    it('should indicate a row that has been selected for deletion', () => {
      const deleteRow = fixture.debugElement.query(By.css('.table-danger'));
      expect(deleteRow.nativeElement.innerHTML).toContain('/processes/' + processes[1].processId);
    });

  });
});
