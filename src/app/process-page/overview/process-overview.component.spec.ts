import { ProcessOverviewComponent } from './process-overview.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VarDirective } from '../../shared/utils/var.directive';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { ProcessDataService } from '../../core/data/processes/process-data.service';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { ProcessBulkDeleteService } from './process-bulk-delete.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProcessOverviewService } from './process-overview.service';

describe('ProcessOverviewComponent', () => {
  let component: ProcessOverviewComponent;
  let fixture: ComponentFixture<ProcessOverviewComponent>;

  let processService: ProcessDataService;

  let processBulkDeleteService;
  let modalService;

  function init() {
    processService = jasmine.createSpyObj('processOverviewService', {
      timeStarted: '2024-02-05 16:43:32',
    });

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
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [ProcessOverviewComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ProcessOverviewService, useValue: processService },
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
      component.openDeleteModal({} as TemplateRef<any>);
      expect(modalService.open).toHaveBeenCalledWith({});
    });
  });

  describe('deleteSelected', () => {
    it('should call the deleteSelectedProcesses method on the processBulkDeleteService and close the modal when processing is done', () => {
      spyOn(component, 'closeModal');

      component.deleteSelected();

      expect(processBulkDeleteService.deleteSelectedProcesses).toHaveBeenCalled();
      expect(component.closeModal).toHaveBeenCalled();
    });
  });
});
