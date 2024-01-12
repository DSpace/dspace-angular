import { ProcessOverviewComponent } from './process-overview.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VarDirective } from '../../shared/utils/var.directive';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProcessDataService } from '../../core/data/processes/process-data.service';
import { Process } from '../processes/process.model';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { By } from '@angular/platform-browser';
import { ProcessStatus } from '../processes/process-status.model';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { PaginationService } from '../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ProcessBulkDeleteService } from './process-bulk-delete.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('ProcessOverviewComponent', () => {
  let component: ProcessOverviewComponent;
  let fixture: ComponentFixture<ProcessOverviewComponent>;

  let processService: ProcessDataService;
  let ePersonService: EPersonDataService;
  let paginationService;

  let processes: Process[];
  let ePerson: EPerson;

  let processBulkDeleteService;
  let modalService;

  const pipe = new DatePipe('en-US');

  function init() {
    processes = [
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
      findAll: createSuccessfulRemoteDataObject$(createPaginatedList(processes))
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
      if (id === 2) {
        return true;
      } else {
        return false;
      }
    });

    modalService = jasmine.createSpyObj('modalService', {
      open: {}
    });
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [ProcessOverviewComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ProcessDataService, useValue: processService },
        { provide: EPersonDataService, useValue: ePersonService },
        { provide: PaginationService, useValue: paginationService },
        { provide: ProcessBulkDeleteService, useValue: processBulkDeleteService },
        { provide: NgbModal, useValue: modalService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('overview buttons', () => {
    it('should show a button to clear selected processes when there are selected processes', () => {
      const clearButton = fixture.debugElement.query(By.css('.btn-primary'));
      expect(clearButton.nativeElement.innerHTML).toContain('process.overview.delete.clear');

      clearButton.triggerEventHandler('click', null);
      expect(processBulkDeleteService.clearAllProcesses).toHaveBeenCalled();
    });
    it('should not show a button to clear selected processes when there are no selected processes', () => {
      (processBulkDeleteService.hasSelected as jasmine.Spy).and.returnValue(false);
      fixture.detectChanges();

      const clearButton = fixture.debugElement.query(By.css('.btn-primary'));
      expect(clearButton).toBeNull();
    });
    it('should show a button to open the delete modal when there are selected processes', () => {
      spyOn(component, 'openDeleteModal');

      const deleteButton = fixture.debugElement.query(By.css('.btn-danger'));
      expect(deleteButton.nativeElement.innerHTML).toContain('process.overview.delete');

      deleteButton.triggerEventHandler('click', null);
      expect(component.openDeleteModal).toHaveBeenCalled();
    });
    it('should not show a button to clear selected processes when there are no selected processes', () => {
      (processBulkDeleteService.hasSelected as jasmine.Spy).and.returnValue(false);
      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(By.css('.btn-danger'));
      expect(deleteButton).toBeNull();
    });
  });

  describe('openDeleteModal', () => {
    it('should open the modal', () => {
      component.openDeleteModal({});
      expect(modalService.open).toHaveBeenCalledWith({});
    });
  });

  describe('deleteSelected', () => {
    it('should call the deleteSelectedProcesses method on the processBulkDeleteService and close the modal when processing is done', () => {
      spyOn(component, 'closeModal');
      spyOn(component, 'setProcesses');

      component.deleteSelected();

      expect(processBulkDeleteService.deleteSelectedProcesses).toHaveBeenCalled();
      expect(component.closeModal).toHaveBeenCalled();
      expect(component.setProcesses).toHaveBeenCalled();
    });
  });
});
