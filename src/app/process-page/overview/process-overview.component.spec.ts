import { ProcessOverviewComponent } from './process-overview.component';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { VarDirective } from '../../shared/utils/var.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject, of, of as observableOf } from 'rxjs';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { NotificationsServiceStub } from 'src/app/shared/testing/notifications-service.stub';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { ProcessDataService } from '../../core/data/processes/process-data.service';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { PaginationService } from '../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';
import { DatePipe } from '@angular/common';
import { ProcessBulkDeleteService } from './process-bulk-delete.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProcessStatus } from '../processes/process-status.model';
import { Process } from '../processes/process.model';

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

  let processBulkDeleteService;
  let modalService;

  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  const pipe = new DatePipe('en-US');

  function init() {
    adminProcesses = [
      Object.assign(new Process(), {
        processId: 1,
        scriptName: 'script-name',
        startTime: '2020-03-19 00:30:00',
        endTime: '2020-03-19 23:30:00',
        processStatus: ProcessStatus.COMPLETED,
        userId: 'testid'
      }),
      Object.assign(new Process(), {
        processId: 2,
        scriptName: 'script-name',
        startTime: '2020-03-20 00:30:00',
        endTime: '2020-03-20 23:30:00',
        processStatus: ProcessStatus.FAILED,
        userId: 'testid'
      }),
      Object.assign(new Process(), {
        processId: 3,
        scriptName: 'another-script-name',
        startTime: '2020-03-21 00:30:00',
        endTime: '2020-03-21 23:30:00',
        processStatus: ProcessStatus.RUNNING,
        userId: 'testid'
      })
    ];
    noAdminProcesses = [
      Object.assign(new Process(), {
        processId: 1,
        scriptName: 'script-name',
        startTime: '2020-03-19',
        endTime: '2020-03-19',
        processStatus: ProcessStatus.COMPLETED,
        userId: 'noadmin'
      }),
      Object.assign(new Process(), {
        processId: 2,
        scriptName: 'another-script-name',
        startTime: '2020-03-21',
        endTime: '2020-03-21',
        processStatus: ProcessStatus.RUNNING,
        userId: 'noadmin'
      })
    ];
    ePerson = Object.assign(new EPerson(), {
      id: 'testid',
      uuid: 'testid',
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
      searchItsOwnProcesses: createSuccessfulRemoteDataObject$(createPaginatedList(noAdminProcesses)),
      searchBy: createSuccessfulRemoteDataObject$(createPaginatedList(noAdminProcesses)),
      delete: createSuccessfulRemoteDataObject$(null),
      setStale: observableOf(true)
    });
    ePersonService = jasmine.createSpyObj('ePersonService', {
      findById: createSuccessfulRemoteDataObject$(ePerson)
    });
    authorizationService = jasmine.createSpyObj('authorizationService', ['isAuthorized']);

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

    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['get']);

    TestBed.configureTestingModule({
      declarations: [ProcessOverviewComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ProcessDataService, useValue: processService },
        { provide: EPersonDataService, useValue: ePersonService },
        { provide: PaginationService, useValue: paginationService },
        { provide: ProcessBulkDeleteService, useValue: processBulkDeleteService },
        { provide: NgbModal, useValue: modalService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessOverviewComponent);
    component = fixture.componentInstance;
  });

  describe('if the current user is an admin', () => {

    beforeEach(() => {
      authorizationService.isAuthorized.and.callFake(() => of(true));
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

      it('should display a delete button in the seventh column', () => {
        rowElements.forEach((rowElement, index) => {
          const el = rowElement.query(By.css('td:nth-child(7)'));
          expect(el.nativeElement.innerHTML).toContain('fas fa-trash');

          el.query(By.css('button')).triggerEventHandler('click', null);
          expect(processBulkDeleteService.toggleDelete).toHaveBeenCalledWith(noAdminProcesses[index].processId);
        });
      });

      it('should indicate a row that has been selected for deletion', () => {
        const deleteRow = fixture.debugElement.query(By.css('.table-danger'));
        console.log(noAdminProcesses, deleteRow?.nativeElement.innerHTML);
        // expect(deleteRow.nativeElement.innerHTML).toContain('/processes/' + noAdminProcesses[0].processId);
      });

    });

  });

  describe('overview buttons', () => {
    beforeEach(() => {
      authorizationService.isAuthorized.and.callFake(() => of(false));
      fixture.detectChanges();
    });

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
    beforeEach(() => {
      authorizationService.isAuthorized.and.callFake(() => of(false));
      fixture.detectChanges();
    });

    it('should open the modal', () => {
      component.openDeleteModal({});
      expect(modalService.open).toHaveBeenCalledWith({});
    });
  });

  describe('deleteSelected', () => {
    beforeEach(() => {
      authorizationService.isAuthorized.and.callFake(() => of(false));
      fixture.detectChanges();
    });

    it('should call the deleteSelectedProcesses method on the processBulkDeleteService and close the modal when processing is done', () => {
      spyOn(component, 'closeModal');
      spyOn(component, 'setProcesses');

      component.deleteSelected();

      expect(processBulkDeleteService.deleteSelectedProcesses).toHaveBeenCalled();
      expect(component.closeModal).toHaveBeenCalled();
      expect(component.setProcesses).toHaveBeenCalled();
    });
  });

  describe('getEPersonName function', () => {
    beforeEach(() => {
      authorizationService.isAuthorized.and.callFake(() => of(false));
      fixture.detectChanges();
    });

    it('should return unknown user when id is null', (done: DoneFn) => {
      const id = null;
      const expectedTranslation = 'process.overview.unknown.user';

      translateServiceSpy.get(expectedTranslation);

      component.getEpersonName(id).subscribe((result: string) => {
        expect(result).toBe(expectedTranslation);
        done();
      });
      expect(translateServiceSpy.get).toHaveBeenCalledWith('process.overview.unknown.user');
    });

    it('should return unknown user when id is invalid', (done: DoneFn) => {
      const id = '';
      const expectedTranslation = 'process.overview.unknown.user';

      translateServiceSpy.get(expectedTranslation);

      component.getEpersonName(id).subscribe((result: string) => {
        expect(result).toBe(expectedTranslation);
        done();
      });
      expect(translateServiceSpy.get).toHaveBeenCalledWith('process.overview.unknown.user');
    });

    it('should return EPerson name when id is correct', (done: DoneFn) => {
      const id = 'testid';
      const expectedName = 'John Doe';

      component.getEpersonName(id).subscribe((result: string) => {
        expect(result).toEqual(expectedName);
        done();
      });
      expect(translateServiceSpy.get).not.toHaveBeenCalled();
    });
  });
});
